import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

module {
  type UserId = Principal;
  type MessageId = Nat;

  type Message = {
    id : MessageId;
    senderId : UserId;
    recipientId : UserId;
    content : Text;
    sentAt : Int;
  };

  type OldActor = {};

  type NewActor = {
    friendsStore : Map.Map<UserId, Set.Set<UserId>>;
    messageStore : Map.Map<Text, List.List<Message>>;
    messageCounter : { var nextId : MessageId };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      friendsStore = Map.empty<UserId, Set.Set<UserId>>();
      messageStore = Map.empty<Text, List.List<Message>>();
      messageCounter = { var nextId = 0 };
    };
  };
};
