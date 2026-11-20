import { Link } from "react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { product } from "@/config";

export function Landing() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{product.tagline}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{product.description}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" asChild><Link to="/signup">Start free</Link></Button>
          <Button size="lg" variant="outline" asChild><a href="#pricing">See pricing</a></Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-24 sm:grid-cols-3">
        {product.features.map((f) => (
          <Card key={f.title}>
            <CardHeader><CardTitle>{f.title}</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">{f.body}</CardContent>
          </Card>
        ))}
      </section>

      <section id="pricing" className="mx-auto max-w-4xl px-4 pb-24">
        <h2 className="mb-8 text-center text-3xl font-bold">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {product.plans.map((p) => (
            <Card key={p.id} className={p.id === "pro" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <div className="mt-2 text-3xl font-bold">
                  {p.price}<span className="text-base font-normal text-muted-foreground"> {p.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm"><Check className="text-primary" />{feat}</li>
                  ))}
                </ul>
                <Button className="w-full" variant={p.id === "pro" ? "default" : "outline"} asChild>
                  <Link to="/signup">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {product.name} · <a href={`mailto:${product.supportEmail}`}>{product.supportEmail}</a>
      </footer>
    </main>
  );
}
