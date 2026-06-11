import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: MessageId;
    content: string;
    sentAt: Timestamp;
    recipientId: UserId;
    senderId: UserId;
}
export type UserId = Principal;
export type Timestamp = bigint;
export interface ConversationSummary {
    lastMessage?: Message;
    friendId: UserId;
    lastActivityAt: Timestamp;
}
export type MessageId = bigint;
export interface Friend {
    userId: UserId;
    addedAt: Timestamp;
}
export interface backendInterface {
    addFriend(friendId: Principal): Promise<void>;
    getMessageHistory(friendId: Principal): Promise<Array<Message>>;
    listConversations(): Promise<Array<ConversationSummary>>;
    listFriends(): Promise<Array<Friend>>;
    removeFriend(friendId: Principal): Promise<void>;
    sendMessage(recipientId: Principal, content: string): Promise<Message>;
}
