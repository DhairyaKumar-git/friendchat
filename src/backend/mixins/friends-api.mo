import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Common "../types/common";
import FriendTypes "../types/friends";
import FriendsLib "../lib/friends";

mixin (friendsStore : Map.Map<Common.UserId, Set.Set<Common.UserId>>) {

  /// Add a friend by their principal ID
  public shared ({ caller }) func addFriend(friendId : Principal) : async () {
    FriendsLib.addFriend(friendsStore, caller, friendId);
  };

  /// Remove a friend from the contact list
  public shared ({ caller }) func removeFriend(friendId : Principal) : async () {
    FriendsLib.removeFriend(friendsStore, caller, friendId);
  };

  /// View the list of friends
  public query ({ caller }) func listFriends() : async [FriendTypes.Friend] {
    FriendsLib.getFriends(friendsStore, caller);
  };
};
