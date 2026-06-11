import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Common "../types/common";
import MsgTypes "../types/messages";
import MessagesLib "../lib/messages";

mixin (
  messageStore : Map.Map<Text, List.List<MsgTypes.Message>>,
  messageCounter : { var nextId : Common.MessageId },
) {

  /// Send a message to a friend
  public shared ({ caller }) func sendMessage(
    recipientId : Principal,
    content : Text,
  ) : async MsgTypes.Message {
    MessagesLib.sendMessage(messageStore, messageCounter, caller, recipientId, content);
  };

  /// Get the message history between the caller and another user
  public query ({ caller }) func getMessageHistory(
    friendId : Principal,
  ) : async [MsgTypes.Message] {
    MessagesLib.getHistory(messageStore, caller, friendId);
  };

  /// View all conversations sorted by most recent message
  public query ({ caller }) func listConversations() : async [MsgTypes.ConversationSummary] {
    MessagesLib.getConversations(messageStore, caller);
  };
};
