"use client";

import { useState } from "react";
import { User } from "@/payload-types";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Shield,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { changePasswordAction } from "@/modules/auth/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecurityViewProps {
  user: User;
}

export const SecurityView = ({ user }: SecurityViewProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        toast.success("Password Updated Successfully", {
          description: "Your account credentials have been securely updated.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "sales_manager":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Account & Security Settings
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage your credentials and view your enterprise security status.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm text-xs font-semibold text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>TLS 1.3 Active</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Security Status Card */}
          <Card className="border-gray-200/80 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-950 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">
                      Identity & Role Authorization
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      Payload CMS Role-Based Access Control
                    </CardDescription>
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {user.role.replace("_", " ")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid sm:grid-cols-3 gap-4 bg-white">
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="text-xs text-gray-500 font-medium">Account Name</div>
                <div className="text-base font-bold text-gray-900 mt-1">{user.name}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="text-xs text-gray-500 font-medium">Email Address</div>
                <div className="text-base font-bold text-gray-900 mt-1 truncate">{user.email}</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                <div className="text-xs text-gray-500 font-medium">Member Since</div>
                <div className="text-base font-bold text-gray-900 mt-1">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Form */}
          <Card className="border-gray-200/80 shadow-sm">
            <CardHeader className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    Update Password
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Ensure your account is using a long, secure passphrase.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                <div className="space-y-2">
                  <Label htmlFor="current-pwd">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-pwd"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-pwd">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-pwd"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <KeyRound className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pwd">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-pwd"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <CheckCircle2 className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-6 rounded-xl shadow-md transition-all active:scale-95"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Credentials...
                    </>
                  ) : (
                    "Save New Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Protocols Overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm flex items-start gap-3.5">
              <Fingerprint className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Encrypted Tokens</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Payload JWT sessions are signed via SHA-256 and stored in secure HttpOnly cookies.
                </p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm flex items-start gap-3.5">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Stripe Isolation</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Payment credentials never touch our database and are processed via PCI-DSS Stripe Elements.
                </p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200/60 shadow-sm flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900">Strict RBAC</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Payload CMS database operations enforce role-scoped read, write, and deletion privileges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
