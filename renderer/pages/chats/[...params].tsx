import { useRecoilState } from "recoil";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import router from "next/router";
import { loginUserInfoAtom, roomIdAtom, roomTypeAtom } from "../../atoms";
import { ipcRenderer } from "electron";
import dynamic from "next/dynamic";
const Messages = dynamic(() => import("../../components/Messages"), {
  ssr: false,
});
const ChatInput = dynamic(() => import("../../components/ChatInput"), {
  ssr: false,
});

interface IFormData {
  text: string;
}
interface IOldMessage {
  id: string;
  author: string;
  createdAt: string;
  rooms: [string[]];
  text: string;
}

interface IUser {
  uid: string;
  email: string;
  createdAt: number;
}

export default function Chats() {
  // const [roomUserId, setRoomUserId] = useState("");
  const [loginInfo, setLoginInfo] = useRecoilState(loginUserInfoAtom);
  const scrollRef = useRef<HTMLInputElement>();
  const [roomType, setRoomType] = useRecoilState(roomTypeAtom);
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  // const [roomId, setRoomId] = useState("");
  const [roomUserid, setRoomUserId] = useState("");
  const [oldMessages, setOldMessages] = useState<IOldMessage[]>([]);
  const [uid, setUid] = useState("");

  // 채팅 메세지 생성시 useState로 새로운 메세지 저장
  const [newMessage, setNewMessage] = useState("");

  //   전송 버튼을 누르고 데이터 저장
  const onFinished = async (values: IFormData) => {
    if (newMessage) {
      if (loginInfo.uid) {
        let data;
        if (roomType === "group") {
          data = {
            createdAt: Date.now(),
            author: loginInfo.email,
            text: values.text,
          };
        } else {
          data = {
            createdAt: Date.now(),
            author: loginInfo.email,
            text: values.text,
            // rooms: [{ uid: [loginId, roomUserId] }],
          };
        }
        ipcRenderer.send("SEND_MESSAGE", data, roomId);
      }

      // Clear input field
      setNewMessage("");
    }
  };

  // 채팅방id 만들기
  const getRoomId = async () => {
    const getRoomUserid = localStorage.getItem("roomUserUid");
    if (!getRoomUserid) {
      router.push("/room");
    } else {
      setRoomUserId(getRoomUserid);
    }
  };

  // 스크롤 내리기
  const scrollToBottom = useCallback(() => {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      // block: "end",
      // inline: "nearest",
    });
  }, [newMessage]);

  useEffect(() => {
    getRoomId();
    // 대화내용 가져오기
    ipcRenderer.send("GETMESSAGES", roomId);
    ipcRenderer.on("GETMESSAGES", async (event, payload) => {
      setOldMessages(payload);
    });
    // 스크롤 하단으로 내리기
    // scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    // scrollToBottom();
    // window.scrollTo(0, document.body.scrollHeight);
  }, [newMessage]);

  // 채팅 작성했을 때 onChanghandler, onSubmitHandler
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewMessage(e.target.value);
  };
  return (
    <React.Fragment>
      <Container>
        <MessagesWrapper>
          <Title>
            {roomType === "group" ? "그룹대화" : roomType + "님과의 대화"}
          </Title>
          <ul>
            {oldMessages &&
              oldMessages
                .sort((first, second) =>
                  first?.createdAt <= second?.createdAt ? -1 : 1
                )
                .map((msg, index) => (
                  <li
                    key={index}
                    style={{ listStyleType: "none", paddingBottom: "10px" }}
                  >
                    <Messages {...msg} />
                  </li>
                ))}
          </ul>
        </MessagesWrapper>
        <InputWrapper>
          <ChatInput
            newMessage={newMessage}
            onFinished={onFinished}
            handleOnChange={handleOnChange}
          />
        </InputWrapper>
      </Container>
    </React.Fragment>
  );
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const MessagesWrapper = styled.div`
  background-color: #a8c0cc;
  padding: 20px;
  height: 100%;
  margin-bottom: 50px;
  overflow: scroll;
  ul {
    padding: 0;
    margin: 0;
  }
`;
const InputWrapper = styled.div`
  width: 100vw;
`;
const Title = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  color: #515151;
`;
