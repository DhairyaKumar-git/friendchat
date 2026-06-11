import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGetMessageHistory } from "@/hooks/useBackend";
import type { Principal } from "@icp-sdk/core/principal";
import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

interface ConversationThreadProps {
  friendId: Principal;
}

function formatTime(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function FriendAvatar({ userId }: { userId: { toString(): string } }) {
  const str = userId.toString();
  const initials = str.slice(0, 2).toUpperCase();
  const hue = (str.charCodeAt(0) * 37 + str.charCodeAt(1) * 13) % 360;
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0"
      style={{ background: `oklch(0.55 0.14 ${hue})` }}
    >
      {initials}
    </div>
  );
}

const SKELETON_DIRS = [
  { key: "sk-a", align: "items-start", width: "w-64" },
  { key: "sk-b", align: "items-end", width: "w-48" },
  { key: "sk-c", align: "items-start", width: "w-56" },
  { key: "sk-d", align: "items-end", width: "w-40" },
] as const;

export default function ConversationThread({
  friendId,
}: ConversationThreadProps) {
  const { isSelf } = useAuth();
  const { data: messages, isLoading } = useGetMessageHistory(friendId);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messageCount = messages?.length ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: messageCount is a stable primitive derived from messages, intentionally used to trigger scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="bg-card border-b border-border px-5 py-3 flex items-center gap-3 shrink-0">
        <FriendAvatar userId={friendId} />
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-foreground truncate">
            {friendId.toString().slice(0, 20)}…
          </p>
          <p className="text-xs text-muted-foreground">Friend</p>
        </div>
      </div>

      {/* Messages scroll area */}
      <ScrollArea className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {SKELETON_DIRS.map(({ key, align, width }) => (
              <div key={key} className={`flex flex-col ${align}`}>
                <Skeleton className={`h-10 rounded-2xl ${width}`} />
              </div>
            ))}
          </div>
        ) : messages?.length === 0 ? (
          <div
            data-ocid="chat.empty_state"
            className="flex flex-col items-center justify-center h-full text-center py-16"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <p className="font-display text-base font-semibold text-foreground mb-1">
              Start the conversation
            </p>
            <p className="text-sm text-muted-foreground">
              Send your first message below.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {messages?.map((msg, i) => {
              const mine = isSelf(msg.senderId);
              return (
                <motion.div
                  key={String(msg.id)}
                  data-ocid={`chat.message.${i + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col ${
                    mine ? "items-end" : "items-start"
                  } mb-1`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      mine
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 px-1">
                    {formatTime(msg.sentAt)}
                  </span>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <MessageInput recipientId={friendId} />
    </div>
  );
}
