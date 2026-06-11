import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Suspense, lazy } from "react";
import Layout from "./Layout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

function AppSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="h-14 bg-card border-b border-border" />
      <div className="flex-1 flex">
        <div className="w-72 bg-card border-r border-border p-4 flex flex-col gap-3">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <Skeleton key={k} className="h-14 w-full rounded-xl" />
          ))}
        </div>
        <div className="flex-1" />
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isInitializing } = useInternetIdentity();

  if (isInitializing) return <AppSkeleton />;

  return (
    <Layout showHeader={isAuthenticated}>
      <Suspense fallback={<AppSkeleton />}>
        {isAuthenticated ? <ChatPage /> : <LoginPage />}
      </Suspense>
    </Layout>
  );
}
