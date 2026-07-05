"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { loginAction } from "@/actions/auth";
import { toast } from "sonner";
import { Compass, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const adminPath = (params?.adminPath as string) || "dashboard-x7k92m-admin";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await loginAction({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        toast.success("Welcome back! Logging in...");
        // Wait briefly for toast to show
        setTimeout(() => {
          router.push(`/${adminPath}/dashboard`);
          router.refresh();
        }, 800);
      } else {
        toast.error(result.error || "Invalid login credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-sand-100/50 py-12 px-6 overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gold-300/30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-sage-100/40 pointer-events-none -z-1" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 rounded-2xl bg-sage-950 text-gold-400 mb-4 shadow-lg shadow-sage-900/10">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Yogabhyasi</h1>
          <p className="text-sm text-sage-600 font-light mt-1">Administrator Dashboard Login</p>
        </div>

        {/* Login Glass Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white p-8 md:p-10 shadow-xl shadow-sage-950/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-sage-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
                <input
                  type="email"
                  disabled={isLoading}
                  placeholder="admin@yogabhyasi.com"
                  {...register("email")}
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-sage-200 bg-white/50 text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 disabled:opacity-50 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-sage-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-sage-200 bg-white/50 text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 disabled:opacity-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                />
                <span className="text-xs font-semibold text-sage-600">Remember me</span>
              </label>
              <span className="text-xs font-semibold text-gold-600 hover:text-gold-700 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="py-3.5 rounded-xl font-semibold shadow-md mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
