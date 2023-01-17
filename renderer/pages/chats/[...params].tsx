import { useRecoilState } from "recoil";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import router from "next/router";
import { roomIdAtom } from "../../atoms";
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
  const [roomUserId, setRoomUserId] = useState("");
  const [loginInfo, setLoginInfo] = useState<IUser>();

  const [roomType, setRoomType] = useRecoilState(roomIdAtom);
  const [roomId, setRoomId] = useState("");
  const [oldMessages, setOldMessages] = useState<IOldMessage[]>([]);
  const [uid, setUid] = useState("");
  // 포커싱과 하단 스크롤을 위한 useRef
  const inputRef = useRef();
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

  useEffect(() => {
    const roomUserUid = localStorage.getItem("roomUserUid");
    // 채팅방id 만들기
    if (!roomUserUid) {
      router.push("/room");
    } else {
      setRoomUserId(roomUserUid);
      ipcRenderer.send("PROFILE");

      ipcRenderer.on("PROFILE_UID", (event, userInfo) => {
        if (userInfo.uid !== "") {
          let sortedIds;
          if (roomType === "group") {
            sortedIds = "group";
          } else {
            const ids = [userInfo.uid, roomUserUid];
            sortedIds = ids.sort()[0] + ids.sort()[1];
          }
          setRoomId(sortedIds);
          setLoginInfo(userInfo);
          // 대화내용 가져오기
          ipcRenderer.send("MESSAGES", sortedIds);
          ipcRenderer.on("MESSAGES", (event, payload) => {
            setOldMessages(payload);
          });
        } else {
          console.log("");
        }
      });
    }
  }, []);

  // 채팅 작성했을 때 onChanghandler, onSubmitHandler
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewMessage(e.target.value);
  };
  return (
    <React.Fragment>
      <Container>
        <Head children={""}>
          <title>
            {roomType === "group" ? "그룹대화" : roomType + "님과의 대화"}
          </title>
        </Head>
        <MessagesWrapper>
          <div>
            {roomType === "group" ? "그룹대화" : roomType + "님과의 대화"}
          </div>

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
  background-color: #eee;
  padding: 20px;
  height: 100%;
  margin-bottom: 50px;
  overflow: scroll;
`;
const InputWrapper = styled.div`
  width: 100vw;
`;
