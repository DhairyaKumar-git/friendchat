import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Shield, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Messages are stored on the decentralized Internet Computer — no central server, no data leaks.",
  },
  {
    icon: Users,
    title: "Friends Only",
    description:
      "Connect with people you trust. Only your approved friends can message you.",
  },
  {
    icon: Zap,
    title: "Always Available",
    description:
      "Built on blockchain infrastructure that never goes down. Your chats are always accessible.",
  },
];

export default function LoginPage() {
  const { login, isInitializing, isLoggingIn } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
          <MessageCircle className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-display font-semibold text-lg text-foreground tracking-tight">
          Pulse Chat
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-xl"
        >
          {/* Logo mark */}
          <div className="mx-auto mb-8 w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>

          <h1 className="font-display text-4xl font-bold text-foreground mb-4 leading-tight">
            Chat with your
            <br />
            <span className="text-primary">close friends</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            A private messaging space for the people you trust. Powered by the
            Internet Computer — secure by design.
          </p>

          <Button
            data-ocid="login.submit_button"
            size="lg"
            onClick={login}
            disabled={isInitializing || isLoggingIn}
            className="w-full max-w-xs h-13 text-base font-semibold shadow-lg transition-smooth"
          >
            {isInitializing
              ? "Loading..."
              : isLoggingIn
                ? "Opening Internet Identity..."
                : "Sign in with Internet Identity"}
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            No account needed — your identity lives with you.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + i * 0.1,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="bg-card rounded-2xl border border-border p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
