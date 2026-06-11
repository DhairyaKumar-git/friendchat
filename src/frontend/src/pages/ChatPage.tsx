import AddFriendModal from "@/components/AddFriendModal";
import ConversationThread from "@/components/ConversationThread";
import FriendsSidebar from "@/components/FriendsSidebar";
import type { Principal } from "@icp-sdk/core/principal";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function ChatPage() {
  const [activeFriendId, setActiveFriendId] = useState<Principal | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleSelectFriend = (friendId: Principal) => {
    setActiveFriendId(friendId);
  };

  const handleBack = () => {
    setActiveFriendId(null);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar — hidden on mobile when conversation open */}
      <div
        data-ocid="chat.sidebar_container"
        className={`shrink-0 ${
          activeFriendId ? "hidden md:flex" : "flex"
        } w-full md:w-72 lg:w-80 flex-col`}
      >
        <FriendsSidebar
          activeFriendId={activeFriendId}
          onSelectFriend={handleSelectFriend}
          onAddFriend={() => setAddOpen(true)}
        />
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {activeFriendId ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFriendId.toString()}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col h-full"
            >
              {/* Mobile back button */}
              <button
                data-ocid="chat.back_button"
                type="button"
                onClick={handleBack}
                className="md:hidden flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-card border-b border-border transition-smooth shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to friends
              </button>
              <div className="flex-1 overflow-hidden">
                <ConversationThread friendId={activeFriendId} />
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            data-ocid="chat.empty_conversation"
            className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">
              Select a conversation
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Choose a friend from the sidebar or add a new one to start
              chatting.
            </p>
          </div>
        )}
      </div>

      <AddFriendModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
