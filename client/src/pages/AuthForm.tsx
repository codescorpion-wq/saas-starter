import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setLoading(true);
    const { error } = isSignup
      ? await signUp.email({ email, password, name: String(f.get("name") || email.split("@")[0]) })
      : await signIn.email({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message ?? "Something went wrong");
    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{isSignup ? "Create your account" : "Welcome back"}</CardTitle>
          <CardDescription>{isSignup ? "Start free — no card needed." : "Log in to continue."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" /></div>
            )}
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Please wait…" : isSignup ? "Sign up" : "Log in"}</Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => signIn.social({ provider: "google", callbackURL: "/dashboard" })}
            >
              Continue with Google
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSignup ? <>Have an account? <Link to="/login" className="underline">Log in</Link></> : <>New here? <Link to="/signup" className="underline">Sign up</Link></>}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
