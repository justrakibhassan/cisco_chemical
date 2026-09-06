"use server";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function signUpAction(data: {
  email: string;
  password: string;
  name: string;
}) {
  const payload = await getPayload({ config: configPromise });

  try {
    // Check if user already exists
    const existingUser = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: data.email,
        },
      },
    });

    if (existingUser.docs.length > 0) {
      return { error: "User already exists with this email" };
    }

    await payload.create({
      collection: "users",
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    // After sign up, log them in
    const result = await payload.login({
      collection: "users",
      data: {
        email: data.email,
        password: data.password,
      },
      // @ts-expect-error - Payload 3.0 type issues with server actions cookies
      res: await cookies(),
    });

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set("payload-token", result.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  } catch (err: unknown) {
    console.error("Sign up error:", err);
    return { error: (err as Error).message || "Failed to create account" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signInAction(data: { email: string; password: string }) {
  const payload = await getPayload({ config: configPromise });
  try {
    const result = await payload.login({
      collection: "users",
      data: {
        email: data.email,
        password: data.password,
      },
      // @ts-expect-error - Payload 3.0 type issues with server actions cookies
      res: await cookies(),
    });

    if (!result.user || !result.token) {
      return { error: "Invalid email or password" };
    }

    // Manually set the cookie as a failsafe
    const cookieStore = await cookies();
    cookieStore.set("payload-token", result.token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Crucial for local dev with different auth systems
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("signInAction error:", error);
    return { error: "An error occurred during sign in" };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("payload-token");
  
  revalidatePath("/", "layout");
  redirect("/sign-in");
}

export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config: configPromise });
    const userHeaders = await headers();
    const { user } = await payload.auth({ headers: userHeaders });
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function updateUserAction(data: {
  name?: string;
  email?: string;
  avatar?: string;
}) {
  const payload = await getPayload({ config: configPromise });
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  try {
    const updatedUser = await payload.update({
      collection: "users",
      id: user.id,
      data: {
        ...data,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    revalidatePath("/", "layout");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("updateUserAction error:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  if (!data.newPassword || data.newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long" };
  }

  const payload = await getPayload({ config: configPromise });

  try {
    // Verify current password by attempting login
    const loginAttempt = await payload.login({
      collection: "users",
      data: {
        email: user.email,
        password: data.currentPassword,
      },
    });

    if (!loginAttempt.user) {
      return { error: "Current password does not match our records" };
    }

    // Update with new password
    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        password: data.newPassword,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("changePasswordAction error:", err);
    return { error: "Failed to update password. Please check your current password." };
  }
}

export async function getCartAction() {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const payload = await getPayload({ config: configPromise });
    const fullUser = await payload.findByID({
      collection: "users",
      id: user.id,
    });
    return fullUser.cart || [];
  } catch (error) {
    console.error("getCartAction error:", error);
    return null;
  }
}

export async function syncCartAction(cartItems: { id: string; quantity: number; name: string; price: number; image: string; slug: string; isSample?: boolean }[]) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  try {
    const payload = await getPayload({ config: configPromise });

    // Format items for Payload array
    const formattedCart = cartItems.map((item) => {
      // Extract numeric ID from "ID-sample" if present
      const baseId = item.id.includes("-sample") 
        ? Number(item.id.replace("-sample", "")) 
        : Number(item.id);
        
      return {
        product: baseId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image,
        slug: item.slug,
        isSample: item.id.includes("-sample") || item.isSample || false,
      };
    });

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        cart: formattedCart,
      },
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    return { success: true };
  } catch (error) {
    console.error("syncCartAction error:", error);
    return { error: "Failed to sync cart" };
  }
}
