import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddFriend } from "@/hooks/useBackend";
import { Principal } from "@icp-sdk/core/principal";
import { useState } from "react";
import { toast } from "sonner";

interface AddFriendModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFriendModal({ open, onClose }: AddFriendModalProps) {
  const [value, setValue] = useState("");
  const addFriend = useAddFriend();

  const handleAdd = () => {
    try {
      const principal = Principal.fromText(value.trim());
      addFriend.mutate(principal, {
        onSuccess: () => {
          toast.success("Friend added!");
          setValue("");
          onClose();
        },
        onError: () =>
          toast.error("Could not add friend. Check the principal ID."),
      });
    } catch {
      toast.error("Invalid principal ID format.");
    }
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        data-ocid="add_friend.dialog"
        className="bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Add a Friend</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground mb-4">
            Enter your friend's Internet Identity principal to add them.
          </p>
          <Input
            data-ocid="add_friend.input"
            placeholder="aaaaa-bbbbb-ccccc-ddddd-..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="font-mono text-sm"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            data-ocid="add_friend.cancel_button"
            type="button"
            variant="ghost"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="add_friend.confirm_button"
            type="button"
            onClick={handleAdd}
            disabled={!value.trim() || addFriend.isPending}
          >
            {addFriend.isPending ? "Adding..." : "Add Friend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
