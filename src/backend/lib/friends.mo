import Common "../types/common";
import FriendTypes "../types/friends";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";

module {
  public type FriendsStore = Map.Map<Common.UserId, Set.Set<Common.UserId>>;

  public func addFriend(
    store : FriendsStore,
    caller : Common.UserId,
    friendId : Common.UserId,
  ) : () {
    let callerSet = switch (store.get(caller)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        store.add(caller, s);
        s
      };
    };
    callerSet.add(friendId);
    // Also add caller to friendId's set (bidirectional)
    let friendSet = switch (store.get(friendId)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        store.add(friendId, s);
        s
      };
    };
    friendSet.add(caller);
  };

  public func removeFriend(
    store : FriendsStore,
    caller : Common.UserId,
    friendId : Common.UserId,
  ) : () {
    switch (store.get(caller)) {
      case (?s) { s.remove(friendId) };
      case null {};
    };
    switch (store.get(friendId)) {
      case (?s) { s.remove(caller) };
      case null {};
    };
  };

  public func getFriends(
    store : FriendsStore,
    caller : Common.UserId,
  ) : [FriendTypes.Friend] {
    switch (store.get(caller)) {
      case (?friendSet) {
        let now = Time.now();
        friendSet.toArray().map<Principal, FriendTypes.Friend>(func(uid) {
          { userId = uid; addedAt = now }
        });
      };
      case null { [] };
    };
  };

  public func isFriend(
    store : FriendsStore,
    caller : Common.UserId,
    friendId : Common.UserId,
  ) : Bool {
    switch (store.get(caller)) {
      case (?s) { s.contains(friendId) };
      case null { false };
    };
  };
};
