import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns";
import React from "react";
import { styled } from "styled-components";

function formatDate(seconds) {
  let formatDate = "";
  if (seconds) {
    formatDate = formatRelative(new Date(seconds * 1000), new Date());
    formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
  }
  return formatDate;
}

const BubbleStyled = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;

  .avatar {
    margin-right: 10px;
  }

  .author {
    font-weight: bold;
  }

  .date {
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    background-color: #e1e1e1;
    padding: 10px;
    border-radius: 10px;
  }

  .image {
    max-width: 100%;
    height: auto;
  }
`;

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  fileURL,
  isCurrentUser,
  Video,
}) {
  return (
    <BubbleStyled>
      {!isCurrentUser && (
        <div className="avatar">
          <Avatar size="small" src={photoURL}>
            {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
      )}
      <div>
        {!isCurrentUser && (
          <>
            <Typography.Text className="author">{displayName}</Typography.Text>
            <Typography.Text className="date">{formatDate(createdAt?.seconds)}</Typography.Text>
          </>
        )}
        <div className="content">
          <div>
            {Video ? (
              <video controls width="auto" src={Video}></video>
            ) : fileURL ? (
              <img src={`${fileURL}?alt=media`} alt="Hình ảnh" className="image" />
            ) : (
              <Typography.Text>{text}</Typography.Text>
            )}
          </div>
        </div>
      </div>
    </BubbleStyled>
  );
}
