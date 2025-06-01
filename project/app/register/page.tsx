"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add your registration logic here
      console.log({ name, email, password });
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#1A1A1A] border-[#2A2A2A] shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight font-mono text-white mb-2">
            Create Account
          </h1>
          <p className="text-[#00FF94] font-mono">
            Join our creator network
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium font-mono text-white">Full Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder:text-gray-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-mono text-white">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder:text-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-mono text-white">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder:text-gray-500 pr-10"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FF94] hover:text-[#00FF94]/80"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium font-mono text-white">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#2A2A2A] border-[#2A2A2A] text-white placeholder:text-gray-500 pr-10"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FF94] hover:text-[#00FF94]/80"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-sm text-center">
            <span className="text-white font-mono">Already have an account? </span>
            <Link
              href="/login"
              className="text-[#00FF94] hover:text-[#00FF94]/80 font-mono"
            >
              Sign in
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00FF94] text-black hover:bg-[#00FF94]/90 font-mono"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
} 