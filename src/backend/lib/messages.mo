import Common "../types/common";
import MsgTypes "../types/messages";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // Messages keyed by a canonical conversation key (sorted principal pair)
  public type MessageStore = Map.Map<Text, List.List<MsgTypes.Message>>;
  public type CounterStore = { var nextId : Common.MessageId };

  public func sendMessage(
    store : MessageStore,
    counter : CounterStore,
    sender : Common.UserId,
    recipient : Common.UserId,
    content : Text,
  ) : MsgTypes.Message {
    let id = counter.nextId;
    counter.nextId += 1;
    let msg : MsgTypes.Message = {
      id;
      senderId = sender;
      recipientId = recipient;
      content;
      sentAt = Time.now();
    };
    let key = conversationKey(sender, recipient);
    let convList = switch (store.get(key)) {
      case (?lst) lst;
      case null {
        let lst = List.empty<MsgTypes.Message>();
        store.add(key, lst);
        lst
      };
    };
    convList.add(msg);
    msg;
  };

  public func getHistory(
    store : MessageStore,
    userA : Common.UserId,
    userB : Common.UserId,
  ) : [MsgTypes.Message] {
    let key = conversationKey(userA, userB);
    switch (store.get(key)) {
      case (?lst) { lst.toArray() };
      case null { [] };
    };
  };

  public func getConversations(
    store : MessageStore,
    caller : Common.UserId,
  ) : [MsgTypes.ConversationSummary] {
    let callerText = caller.toText();
    let accumulator = List.empty<MsgTypes.ConversationSummary>();
    for ((key, msgList) in store.entries()) {
      // Key format: "principalA:principalB" (lexicographically sorted)
      let parts = key.split(#char ':');
      let arr = parts.toArray();
      if (arr.size() == 2) {
        let (partA, partB) = (arr[0], arr[1]);
        if (partA == callerText or partB == callerText) {
          let friendText = if (partA == callerText) partB else partA;
          let msgs = msgList.toArray();
          let lastMsg : ?MsgTypes.Message = if (msgs.size() == 0) null else ?(msgs[msgs.size() - 1]);
          let lastActivity : Common.Timestamp = switch (lastMsg) {
            case (?m) m.sentAt;
            case null 0;
          };
          let friendId = switch (lastMsg) {
            case (?m) {
              if (m.senderId.toText() == friendText) m.senderId else m.recipientId
            };
            case null {
              ignore friendText;
              caller
            };
          };
          accumulator.add({
            friendId;
            lastMessage = lastMsg;
            lastActivityAt = lastActivity;
          });
        };
      };
    };
    // Sort by lastActivityAt descending
    let sorted = accumulator.toArray().sort(func(a, b) {
      if (a.lastActivityAt > b.lastActivityAt) #less
      else if (a.lastActivityAt < b.lastActivityAt) #greater
      else #equal
    });
    sorted;
  };

  public func conversationKey(a : Common.UserId, b : Common.UserId) : Text {
    let ta = a.toText();
    let tb = b.toText();
    if (ta < tb) { ta # ":" # tb } else { tb # ":" # ta };
  };
};
