import { Content } from "antd/lib/layout/layout";
import { useRecoilState } from "recoil";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import styled from "styled-components";
import Head from "next/head";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { roomTypeAtom, textAtom } from "../../atoms";
import { auth, dbService } from "../../firebase";
import Messages from "../../components/Messages";
import ChatInput from "../../components/ChatInput";
import router from "next/router";

const socket = io("http://localhost:3000");

interface IFormData {
  text: string;
}
interface ChatText {
  user: string;
  text: string;
}

export default function Chats() {
  const roomId = router.query.params || "";

  const [roomType, setRoomType] = useRecoilState(roomTypeAtom);
  const [inputData, setInputData] = useRecoilState(textAtom);
  const [chatTexts, setChatTexts] = useState<ChatText[]>([]);
  // 포커싱과 하단 스크롤을 위한 useRef
  const inputRef = useRef();
  const bottomListRef = useRef();

  // 채팅 메세지 생성시 useState로 새로운 메세지 저장
  const [newMessage, setNewMessage] = useState("");
  const setTexts = () => {};

  useEffect(() => {
    socket.on("message", function (data) {
      console.log("chat data", data);
      // storageSetTexts(data);
    });
    setTexts();

    socket.emit("joinRoom", roomType);
  }, []);

  const onFinished = async (values: IFormData) => {
    if (newMessage) {
      // Add new message in Firestore
      //   await addDoc(collection(dbService, "messages"), {
      //     createdAt: Date.now(),
      //     author: auth.currentUser.uid,
      //     text: values.text,
      //     roomType: roomType,
      //     rooms: [auth.currentUser.uid, roomId],
      //   });

      // Clear input field
      setNewMessage("");
      // Scroll down to the bottom of the list
      // bottomListRef.current.scrollIntoView({ behavior: "smooth" });
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

        <ContentWrapper>
          <div>
            {roomType === "group" ? "그룹대화" : roomType + "님과의 대화"}
          </div>
          <Messages />
        </ContentWrapper>
        <ChatInput
          newMessage={newMessage}
          onFinished={onFinished}
          handleOnChange={handleOnChange}
        />
      </Container>
    </React.Fragment>
  );
}
const Container = styled.div`
  padding: 20px;
  height: 90vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ContentWrapper = styled.div`
  /* overflow: scroll; */
`;
