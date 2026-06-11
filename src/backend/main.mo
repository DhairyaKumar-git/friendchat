import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import Common "types/common";
import MsgTypes "types/messages";
import FriendsMixin "mixins/friends-api";
import MessagesMixin "mixins/messages-api";

actor {
  // Friends domain state
  let friendsStore : Map.Map<Common.UserId, Set.Set<Common.UserId>>;

  // Messages domain state
  let messageStore : Map.Map<Text, List.List<MsgTypes.Message>>;
  let messageCounter : { var nextId : Common.MessageId };

  include FriendsMixin(friendsStore);
  include MessagesMixin(messageStore, messageCounter);
  include MixinViews();
};
