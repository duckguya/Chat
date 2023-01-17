import { useRecoilState } from "recoil";
import React, { useEffect, useRef, useState } from "react";
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
      setRoomUserId(localStorage.getItem("roomUserUid"));
      // let sortedIds;
      // ipcRenderer.send("PROFILE");
      // ipcRenderer.on("PROFILE_UID", async (event, userInfo) => {
      //   if (userInfo.uid !== "") {
      //     if (roomType === "group") {
      //       sortedIds = "group";
      //     } else {
      //       const ids = [userInfo.uid, roomUserid];
      //       sortedIds = ids.sort()[0] + ids.sort()[1];
      //     }
      //     setRoomId(sortedIds);
      //     setLoginInfo(userInfo);
      //   } else {
      //     console.log("");
      //   }
      // });
    }
  };

  useEffect(() => {
    getRoomId();
    // 대화내용 가져오기
    console.log("roomId", roomId);
    console.log("roomType", roomType);
    console.log("loginInfo", loginInfo);

    ipcRenderer.send("MESSAGES", roomId);
    ipcRenderer.on("MESSAGES", async (event, payload) => {
      setOldMessages(payload);
    });
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
          <Title>
            {roomType === "group" ? "그룹대화" : roomType + "님과의 대화"}
          </Title>

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
  background-color: #a8c0cc;
  padding: 20px;
  height: 100%;
  margin-bottom: 50px;
  overflow: scroll;
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
