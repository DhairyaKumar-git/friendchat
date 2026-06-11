import Common "common";

module {
  public type FriendStatus = {
    #active;
  };

  public type Friend = {
    userId : Common.UserId;
    addedAt : Common.Timestamp;
  };
};
