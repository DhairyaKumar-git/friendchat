import type { Principal } from "@icp-sdk/core/principal";

export type UserId = Principal;
export type Timestamp = bigint;
export type MessageId = bigint;

export interface Friend {
  userId: UserId;
  addedAt: Timestamp;
}

export interface Message {
  id: MessageId;
  content: string;
  sentAt: Timestamp;
  recipientId: UserId;
  senderId: UserId;
}

export interface ConversationSummary {
  lastMessage?: Message;
  friendId: UserId;
  lastActivityAt: Timestamp;
}

export type LoginStatus =
  | "idle"
  | "initializing"
  | "logging-in"
  | "success"
  | "loginError";
