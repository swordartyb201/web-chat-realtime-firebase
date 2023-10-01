import React, { useContext, useState } from "react";
import { Collapse, Typography, Avatar, Button, Input } from "antd";
import { styled } from "styled-components";
import { PlusCircleFilled } from "@ant-design/icons";
import { AppContext } from "../../../Context/AppProvider";

const { Panel } = Collapse;
const { Search } = Input;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .ant-collapse-header {
      font-weight: bold;
    }

    .ant-btn-default:hover {
      color: #000;
    }

    .ant-btn-default {
      border: 1px solid transparent !important;
      font-weight: bold;
    }
  }

  .username {
    font-weight: bold;
  }

  .btn-add-room {
  }
`;

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;

  .text-line {
    margin: unset;
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: black;

  .username {
    color: white;
    margin-left: 5px;
    font-weight: bold;
  }
`;

export default function ChatList() {
  const {
    groups,
    data,
    setIsAddGroupOpen,
    setIsAddFriendOpen,
    setSelectedGroupId,
    setSelectedFriendId,
  } = useContext(AppContext);

  const handleAddGroup = () => {
    setIsAddGroupOpen(true);
  };

  const handleAddFriend = () => {
    setIsAddFriendOpen(true);
  };

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredData = data.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <WrapperStyled>
        <h1 className="text-line">Chat</h1>
      </WrapperStyled>
      <Search
        placeholder="Tìm kiếm bạn bè"
        onChange={handleSearchChange}
        value={searchValue}
        style={{ width: "200px", margin: "0 auto", marginBottom: "10px", display: "block" }}
      />
      <Collapse ghost defaultActiveKey={["1"]}>
        <PanelStyled header="Danh sách người dùng" key="1">
          {filteredData.map((friend) => (
            <LinkStyled key={friend.id} onClick={() => setSelectedFriendId(friend)}>
              {" "}
              {/* Thêm sự kiện khi người dùng nhấn */}
              <Avatar src={friend.photoURL}>
                {friend.photoURL ? "" : friend.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography.Text className="username">{friend.displayName}</Typography.Text>
            </LinkStyled>
          ))}
          <LinkStyled>
            <Button ghost icon={<PlusCircleFilled />} onClick={handleAddFriend}>
              Thêm bạn
            </Button>
          </LinkStyled>
        </PanelStyled>
      </Collapse>
      <Collapse ghost defaultActiveKey={["2"]}>
        <PanelStyled header="Danh sách các nhóm" key="2">
          {groups.map((group) => (
            <LinkStyled key={group.id} onClick={() => setSelectedGroupId(group.id)}>
              {group.name}
            </LinkStyled>
          ))}
          <LinkStyled>
            <Button ghost icon={<PlusCircleFilled />} onClick={handleAddGroup}>
              Tạo nhóm
            </Button>
          </LinkStyled>
        </PanelStyled>
      </Collapse>
    </div>
  );
}
