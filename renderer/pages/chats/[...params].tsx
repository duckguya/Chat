import { useRecoilState } from "recoil";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, dbService } from "../../firebase";
// import Messages from "../../components/Messages";
// import ChatInput from "../../components/ChatInput";
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

export default function Chats() {
  const [roomUserId, setRoomUserId] = useState("");
  const [loginId, setLoginId] = useState("");

  const [roomType, setRoomType] = useRecoilState(roomIdAtom);
  const [roomId, setRoomId] = useState("");
  const [oldMessages, setOldMessages] = useState<IOldMessage[]>([]);
  const [uid, setUid] = useState("");
  // 포커싱과 하단 스크롤을 위한 useRef
  const inputRef = useRef();
  const bottomListRef = useRef();
  // 채팅 메세지 생성시 useState로 새로운 메세지 저장
  const [newMessage, setNewMessage] = useState("");

  const setTexts = async () => {
    try {
      const q = query(
        collection(dbService, `messages${roomId}`),
        orderBy("createdAt", "desc"),
        limit(100)
      );
      let msgList = [];
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const mObj = {
            ...doc.data(),
            id: doc.id,
          };
          msgList.push(mObj);
        });
        setOldMessages(msgList);
        console.log(" ", msgList);
      });
      // const querySnapshot = await getDocs(q);
      // console.log(msgList);
    } catch (error) {
      console.log("error", error);
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
      ipcRenderer.on("PROFILE", (event, payload) => {
        if (payload !== "") {
          const ids = [payload, roomUserUid];
          let sortedIds = ids.sort()[0] + ids.sort()[1];
          console.log("sortedIds", sortedIds);
          setRoomId(sortedIds);
          setTexts();
        } else {
          console.log(payload);
        }
      });
    }
  }, []);

  //   전송 버튼을 누르고 데이터 저장
  const onFinished = async (values: IFormData) => {
    if (newMessage) {
      try {
        ipcRenderer.send("PROFILE");
        ipcRenderer.on("PROFILE", (event, payload) => {
          setUid(payload);
        });
        // Add new message in Firestore
        await addDoc(collection(dbService, `messages${roomId}`), {
          createdAt: Date.now(),
          author: loginId,
          text: values.text,
          rooms: [{ uid: [uid, roomUserId] }],
        });
        // Clear input field
        setNewMessage("");
        // Scroll down to the bottom of the list
        // bottomListRef.current.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  // 채팅 작성했을 때 onChanghandler, onSubmitHandler
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
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
  height: 92.2vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const MessagesWrapper = styled.div`
  background-color: #eee;
  padding: 20px;
  height: 100%;

  /* overflow: scroll; */
`;
const InputWrapper = styled.div`
  width: 100vw;
`;
