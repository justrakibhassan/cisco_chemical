"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck, Terminal, ArrowLeft } from "lucide-react";

import { signInAction } from "../../actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authLogs, setAuthLogs] = useState<string[]>([
    "SEC: TLS 1.3 Connection handshake complete.",
    "SYS: Checking CISCO Chem core modules...",
    "SEC: Socket connection verified secure.",
    "SYS: Awaiting credentials input...",
  ]);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const logs = [
        "SEC: Verification sub-routine ready.",
        "SYS: DB status: Active, 0ms latency.",
        "SEC: SHA-256 session integrity check: OK.",
        "SYS: Real-time logistics ledger synced.",
        "SEC: Encrypted partner handshake verified.",
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      const timeStr = new Date().toLocaleTimeString().split(" ")[0];
      setAuthLogs((prev) => [`[${timeStr}] ${randomLog}`, ...prev.slice(0, 3)]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      const result = await signInAction(data);
      if (result?.success) {
        toast.success("Login Successful", {
          description: "Welcome back to Cisco Chemical.",
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Authentication Failed", {
          description:
            result?.error || "Invalid email or password. Please try again.",
        });
      }
    } catch {
      toast.error("An error occurred", {
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Left Column: Dark Science Visualizer */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 flex-col justify-between p-12 border-r border-slate-900/60 relative overflow-hidden">
        
        {/* Background Gradients & Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />

        {/* Back Link */}
        <Link
          href="/"
          className="self-start z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        {/* Visual Molecule Rotating Center */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="w-72 h-72 opacity-35"
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" />
              <polygon points="100,45 145,70 145,125 100,150 55,125 55,70" fill="none" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="100" cy="20" r="5" fill="#10b981" className="drop-shadow-[0_0_8px_#10b981]" />
              <circle cx="170" cy="60" r="5" fill="#3b82f6" />
              <circle cx="170" cy="140" r="5" fill="#8b5cf6" />
              <circle cx="100" cy="180" r="5" fill="#f43f5e" />
              <circle cx="30" cy="140" r="5" fill="#06b6d4" />
              <circle cx="30" cy="60" r="5" fill="#3b82f6" />
              <circle cx="100" cy="100" r="8" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <line x1="100" y1="20" x2="100" y2="100" stroke="#334155" strokeWidth="1.5" />
              <line x1="170" y1="60" x2="100" y2="100" stroke="#334155" strokeWidth="1.5" />
              <line x1="170" y1="140" x2="100" y2="100" stroke="#334155" strokeWidth="1.5" />
              <line x1="100" y1="180" x2="100" y2="100" stroke="#334155" strokeWidth="1.5" />
              <line x1="30" y1="140" x2="100" y2="100" stroke="#334155" strokeWidth="1.5" />
              <line x1="30" y1="60" x2="100" y2="100" stroke="#334155" strokeWidth="1.5" />
            </svg>
          </motion.div>

          <div className="absolute text-center space-y-2 mt-40">
            <h2 className="text-xl font-black tracking-tight text-white">Partner & Client Portal</h2>
            <p className="text-xs text-slate-400 font-semibold max-w-[280px]">
              Access formulations, safety sheets, and secure logistics pathways.
            </p>
          </div>
        </div>

        {/* Live Logs Stream Ticker */}
        <div className="z-10 bg-slate-950/80 border border-slate-900 p-4 rounded-xl font-mono text-[9px] text-slate-400 flex flex-col gap-1">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5 mb-1.5">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold uppercase tracking-wider text-slate-500">Security Access Logs</span>
          </div>
          <div className="flex flex-col gap-1 min-h-[60px]">
            {authLogs.map((log, idx) => (
              <div key={idx} className="truncate">
                <span className={log.includes("SEC:") ? "text-emerald-500/80" : "text-blue-400/80"}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Clean Auth Form */}
      <div className="flex-1 w-full bg-slate-50 text-slate-900 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">Sign In</h1>
              <p className="text-sm text-slate-500 font-semibold">
                Access your secure chemical database
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] p-8 sm:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-500 ml-1">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-350 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            placeholder="mail@gmail.com"
                            className="pl-12 h-13 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 ml-1" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-xs font-bold text-slate-500">
                          Password
                        </FormLabel>
                        <button
                          type="button"
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          Forgot?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-350 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 h-13 rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500 ml-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-13 bg-slate-950 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 group flex items-center justify-center gap-1.5 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Enter Catalog</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 bg-white text-slate-400 font-semibold text-[10px] tracking-wider">
                  Authentication
                </span>
              </div>
            </div>

            <Link href="/sign-up" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-13 rounded-xl border-slate-200 hover:border-slate-300 bg-transparent text-slate-800 font-bold text-xs uppercase tracking-[0.15em] transition-all hover:bg-slate-50"
              >
                Create Account
              </Button>
            </Link>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-semibold tracking-wide">
            Cisco Chemical Inc • Industrial Grade Security Portal
          </p>

        </div>
      </div>
    </div>
  );
};
