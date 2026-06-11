import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListConversations,
  useListFriends,
  useRemoveFriend,
} from "@/hooks/useBackend";
import type { ConversationSummary, Friend } from "@/types";
import type { Principal } from "@icp-sdk/core/principal";
import { Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

interface FriendsSidebarProps {
  activeFriendId: Principal | null;
  onSelectFriend: (friendId: Principal) => void;
  onAddFriend: () => void;
}

function relativeTime(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ms).toLocaleDateString();
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

interface SidebarRowProps {
  item: Friend | ConversationSummary;
  isActive: boolean;
  index: number;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

function SidebarRow({
  item,
  isActive,
  index,
  onClick,
  onRemove,
}: SidebarRowProps) {
  const friendId = "userId" in item ? item.userId : item.friendId;
  const lastMsg = "lastMessage" in item ? item.lastMessage : undefined;
  const timestamp =
    "lastActivityAt" in item ? item.lastActivityAt : item.addedAt;
  const preview = lastMsg?.content ?? "No messages yet";
  const hasRecent = !!lastMsg;

  return (
    <div className="relative group">
      <button
        type="button"
        data-ocid={`chat.item.${index}`}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-smooth ${
          isActive
            ? "bg-primary/15 border border-primary/25"
            : "hover:bg-secondary border border-transparent"
        }`}
      >
        <div className="relative">
          <FriendAvatar userId={friendId} />
          {hasRecent && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm font-medium text-foreground truncate">
              {friendId.toString().slice(0, 12)}…
            </span>
            <span className="text-[11px] text-muted-foreground shrink-0">
              {relativeTime(timestamp)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {preview}
          </p>
        </div>
      </button>
      <button
        data-ocid={`chat.remove_friend_button.${index}`}
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
        aria-label="Remove friend"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function FriendsSidebar({
  activeFriendId,
  onSelectFriend,
  onAddFriend,
}: FriendsSidebarProps) {
  const { data: friends, isLoading: friendsLoading } = useListFriends();
  const { data: conversations, isLoading: convsLoading } =
    useListConversations();
  const removeFriend = useRemoveFriend();
  const isLoading = friendsLoading || convsLoading;

  // Sort by most recent activity: prefer conversations (have lastActivityAt), fall back to friends
  const sidebarItems: (Friend | ConversationSummary)[] = (() => {
    if (conversations && conversations.length > 0) {
      const sorted = [...conversations].sort((a, b) =>
        Number(b.lastActivityAt - a.lastActivityAt),
      );
      return sorted;
    }
    return friends ?? [];
  })();

  const handleRemove = (e: React.MouseEvent, friendId: Principal) => {
    e.stopPropagation();
    removeFriend.mutate(friendId, {
      onSuccess: () => toast.success("Friend removed."),
      onError: () => toast.error("Could not remove friend."),
    });
  };

  return (
    <aside
      data-ocid="chat.sidebar"
      className="bg-card border-r border-border flex flex-col h-full w-full"
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between shrink-0 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-display text-sm font-semibold text-foreground">
            Friends List
          </span>
        </div>
        <Button
          data-ocid="chat.add_friend_button"
          type="button"
          variant="ghost"
          size="icon"
          onClick={onAddFriend}
          className="w-8 h-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
          aria-label="Add friend"
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 px-3 py-2">
        {isLoading ? (
          <div className="flex flex-col gap-2 pt-1">
            {["sa", "sb", "sc", "sd", "se"].map((k) => (
              <Skeleton key={k} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : sidebarItems.length === 0 ? (
          <div
            data-ocid="chat.friends.empty_state"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="font-display text-sm font-semibold text-foreground mb-1">
              No friends yet
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Add a friend to start chatting
            </p>
            <Button
              data-ocid="chat.first_add_friend_button"
              type="button"
              size="sm"
              onClick={onAddFriend}
              className="gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Friend
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 pt-1">
            {sidebarItems.map((item, i) => {
              const friendId = "userId" in item ? item.userId : item.friendId;
              return (
                <SidebarRow
                  key={friendId.toString()}
                  item={item}
                  isActive={activeFriendId?.toString() === friendId.toString()}
                  index={i + 1}
                  onClick={() => onSelectFriend(friendId)}
                  onRemove={(e) => handleRemove(e, friendId)}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
