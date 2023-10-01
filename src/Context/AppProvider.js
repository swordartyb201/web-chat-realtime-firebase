import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const {
    user: { uid },
  } = useContext(AuthContext);

  const condition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValues: uid,
    };
  }, [uid]);

  const groups = useFirestore("groups", condition);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || {},
    [groups, selectedGroupId]
  );

  const userCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValues: selectedGroup.members,
    };
  }, [selectedGroup.members]);
  const members = useFirestore("users", userCondition);

  const friends = useFirestore("friends", condition);
  const result = useMemo(() => {
    return friends.map((friend) => {
      if (uid === friend.members[0]) {
        return friend.members[1];
      } else {
        return friend.members[0];
      }
    });
  }, [friends, uid]);
  const conditions = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValues: result,
    };
  }, [result]);
  const data = useFirestore("users", conditions);

  const selectedFriend = useMemo(
    () => data.find((user) => user.id === selectedFriendId) || {},
    [data, selectedFriendId]
  );

  return (
    <div>
      <AppContext.Provider
        value={{
          groups,
          result,
          data,
          selectedGroup,
          selectedFriend,
          members,
          isAddGroupOpen,
          setIsAddGroupOpen,
          isAddFriendOpen,
          setIsAddFriendOpen,
          selectedGroupId,
          setSelectedGroupId,
          selectedFriendId,
          setSelectedFriendId,
          isInviteMemberOpen,
          setIsInviteMemberOpen,
        }}
      >
        {children}
      </AppContext.Provider>
    </div>
  );
}
