import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Login() {
  return (
    <div className="min-h-dvh relative">
      <div className="honeycomb-bg" />
      <div className="max-w-md mx-auto pt-20">
        <Card className="p-8">
          <h1 className="jc-heading text-3xl mb-6">Sign in to JohnnyCloud</h1>
          <form className="space-y-4">
            <div>
              <label className="text-sm text-jc-dim">Email</label>
              <input type="email" placeholder="you@company.com"
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 focus-glow" />
            </div>
            <div>
              <label className="text-sm text-jc-dim">Password</label>
              <input type="password" placeholder="••••••••"
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl p-3 focus-glow" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-jc-dim">
                <input type="checkbox" className="accent-cyan-400" /> Remember me
              </label>
              <a className="text-jc-cyan">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Card>
        <p className="text-center text-sm text-jc-dim mt-4">
          Honeycomb security theme; matches JohnnyCloud UI.
        </p>
      </div>
    </div>
  );
}
