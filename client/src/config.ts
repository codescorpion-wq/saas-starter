// 👉 The one file to edit when you start a new product.
export const product = {
  name: "Your Product",
  tagline: "One sentence on the painful problem you solve.",
  description: "A short paragraph explaining who it's for and the outcome they get.",
  supportEmail: "hello@yourproduct.com",
  features: [
    { title: "Feature one", body: "What it does and why it matters." },
    { title: "Feature two", body: "What it does and why it matters." },
    { title: "Feature three", body: "What it does and why it matters." },
  ],
  plans: [
    { id: "free", name: "Free", price: "$0", period: "forever", features: ["Core feature", "Limited usage"] },
    { id: "pro", name: "Pro", price: "$12", period: "/month", features: ["Everything in Free", "Unlimited usage", "Priority support"] },
  ],
} as const;
