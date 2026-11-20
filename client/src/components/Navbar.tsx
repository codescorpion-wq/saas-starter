import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { product } from "@/config";
import { signOut, useSession } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold">{product.name}</Link>
        <nav className="flex items-center gap-2">
          {session ? (
            <>
              <Button variant="ghost" asChild><Link to="/dashboard">Dashboard</Link></Button>
              <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/login">Log in</Link></Button>
              <Button asChild><Link to="/signup">Get started</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
