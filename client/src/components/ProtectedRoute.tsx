import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  if (isPending) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
