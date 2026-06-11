import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export default function Layout({ children, showHeader = true }: LayoutProps) {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {showHeader && (
        <header className="bg-card border-b border-border px-5 py-3 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-base text-foreground tracking-tight">
              Pulse Chat
            </span>
          </div>
          {isAuthenticated && (
            <Button
              data-ocid="header.logout_button"
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}
        </header>
      )}
      <main className="flex-1 overflow-hidden">{children}</main>
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
}
