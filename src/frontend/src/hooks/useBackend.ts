import { createActor } from "@/backend";
import type { ConversationSummary, Friend, Message } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListFriends() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFriends();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListConversations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ConversationSummary[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listConversations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMessageHistory(friendId: Principal | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Message[]>({
    queryKey: ["messages", friendId?.toString()],
    queryFn: async () => {
      if (!actor || !friendId) return [];
      return actor.getMessageHistory(friendId);
    },
    enabled: !!actor && !isFetching && !!friendId,
    refetchInterval: 3000,
  });
}

export function useAddFriend() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendId: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useRemoveFriend() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendId: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeFriend(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recipientId,
      content,
    }: { recipientId: Principal; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendMessage(recipientId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.recipientId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
