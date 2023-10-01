import { useDropzone } from "react-dropzone";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import styled from "styled-components";
import { SendOutlined, UploadOutlined } from "@ant-design/icons";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Message from "../../Layout/Message";
import { AppContext } from "../../../Context/AppProvider";
import { addDocument } from "../../../firebase/services";
import { AuthContext } from "../../../Context/AuthProvider";
import useFirestore from "../../../hooks/useFirestore";
import { storage } from "../../../firebase/config";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

const WrapperStyled = styled.div`
  height: 100vh;

  .ant-alert-info {
    background-color: transparent;
    border: 1px solid transparent;
    margin: auto;
  }

  .ant-alert-message {
    font-size: 24px;
    font-weight: bold;
  }
`;
const ContentStyled = styled.div`
  height: calc(100vh - 86px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;
const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid #c99fbb;
  border-radius: 10px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;
const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function WebChat() {
  const { selectedGroup } = useContext(AppContext);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext);

  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = () => {
    // Cắt bỏ khoảng trắng ở đầu và cuối chuỗi inputValue
    const trimmedInputValue = inputValue.trim();

    let fileURL = "";
    let Video = "";
    if (trimmedInputValue === "" && !fileURL && !Video) {
      form.resetFields(["message"]);
      return; // Không gửi tin nhắn nếu chuỗi rỗng và không có fileURL hoặc không phải là video
    }

    if (trimmedInputValue || fileURL || Video) {
      const messageData = {
        text: trimmedInputValue,
        uid,
        photoURL,
        roomId: selectedGroup.id,
        displayName,
        fileURL: "",
        Video: "", // Initialize Video property to false
      };

      addDocument("messages", messageData);
    }

    setInputValue("");
    console.log(trimmedInputValue);

    form.resetFields(["message"]);
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const handleUploadFiles = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
          }
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            // Determine if the file is a video based on its type
            const isVideo = file.type.startsWith("video/");

            // Create a message object with the video URL
            const messageData = {
              text: "",
              uid,
              photoURL,
              roomId: selectedGroup.id,
              displayName,
              fileURL: isVideo ? "" : downloadURL,
              Video: isVideo ? downloadURL : "",
            };

            addDocument("messages", messageData);
          });
        }
      );
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ["image/*", "video/*"],
    onDrop: handleUploadFiles,
  });

  const conditions = useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValues: selectedGroup.id,
    }),
    [selectedGroup.id]
  );

  const messages = useFirestore("messages", conditions);
  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      <Row>
        <Col span={4}>
          <Sidebar />
        </Col>
        {selectedGroup.id ? (
          <Col span={20}>
            <Header />
            <ContentStyled>
              <MessageListStyled ref={messageListRef}>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    text={message.text}
                    photoURL={message.photoURL}
                    displayName={message.displayName}
                    createdAt={message.createdAt}
                    fileURL={message.fileURL}
                    Video={message.Video}
                  />
                ))}
              </MessageListStyled>
              <FormStyled form={form}>
                <Form.Item name="message">
                  <Input
                    ref={inputRef}
                    onChange={handleInputChange}
                    onPressEnter={handleOnSubmit}
                    placeholder="Aa"
                    bordered={false}
                    autoComplete="off"
                  />
                </Form.Item>

                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Tippy content="Tải lên">
                    <Button
                      icon={<UploadOutlined />}
                      type="file"
                      onClick={handleInputChange}
                    ></Button>
                  </Tippy>
                </div>

                <Tippy content="Gửi">
                  <Button
                    icon={<SendOutlined />}
                    type="text"
                    onClick={inputValue ? handleOnSubmit : null}
                  ></Button>
                </Tippy>
              </FormStyled>
            </ContentStyled>
          </Col>
        ) : (
          <Alert message="Hãy chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới" />
        )}
      </Row>
    </WrapperStyled>
  );
}
