import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessage } from "@/hooks/useBackend";
import type { Principal } from "@icp-sdk/core/principal";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MessageInputProps {
  recipientId: Principal;
}

export default function MessageInput({ recipientId }: MessageInputProps) {
  const [text, setText] = useState("");
  const sendMessage = useSendMessage();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage.mutate(
      { recipientId, content: trimmed },
      {
        onSuccess: () => setText(""),
        onError: () => toast.error("Failed to send message."),
      },
    );
  };

  return (
    <div className="bg-card border-t border-border px-4 py-3 flex gap-2 shrink-0">
      <Input
        data-ocid="chat.message_input"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        className="flex-1 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
        disabled={sendMessage.isPending}
      />
      <Button
        data-ocid="chat.send_button"
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!text.trim() || sendMessage.isPending}
        className="shrink-0 h-10 w-10"
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
