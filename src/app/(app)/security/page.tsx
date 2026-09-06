import { getCurrentUser } from "@/modules/auth/actions";
import { redirect } from "next/navigation";
import { SecurityView } from "@/modules/dashboard/ui/views/security-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Security | Cisco Chemical Inc.",
  description: "Manage credentials and enterprise role security.",
};

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?callbackUrl=/security");
  }

  return <SecurityView user={user} />;
}
