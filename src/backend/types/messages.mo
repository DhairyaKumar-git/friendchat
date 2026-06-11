import Common "common";

module {
  public type Message = {
    id : Common.MessageId;
    senderId : Common.UserId;
    recipientId : Common.UserId;
    content : Text;
    sentAt : Common.Timestamp;
  };

  public type ConversationSummary = {
    friendId : Common.UserId;
    lastMessage : ?Message;
    lastActivityAt : Common.Timestamp;
  };
};
