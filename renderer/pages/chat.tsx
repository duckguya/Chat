import { Content } from "antd/lib/layout/layout";
import { useRecoilState } from "recoil";
import { clickedIdAtom, textAtom } from "../atoms";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import styled from "styled-components";
import Head from "next/head";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, dbService } from "../firebase";
import Messages from "../components/Messages";
import ChatInput from "../components/ChatInput";

const socket = io("http://localhost:3000");

interface IFormData {
  text: string;
}
interface ChatText {
  user: string;
  text: string;
}

function Chat() {
  const [form] = Form.useForm();
  const [clickedId, setClickId] = useRecoilState(clickedIdAtom);
  const [inputData, setInputData] = useRecoilState(textAtom);
  const [chatTexts, setChatTexts] = useState<ChatText[]>([]);
  // 포커싱과 하단 스크롤을 위한 useRef
  const inputRef = useRef();
  const bottomListRef = useRef();

  // 채팅 메세지 생성시 useState로 새로운 메세지 저장
  const [newMessage, setNewMessage] = useState("");
  const setTexts = () => {};

  const storageSetTexts = (data) => {};

  useEffect(() => {
    socket.on("message", function (data) {
      console.log("chat data", data);
      storageSetTexts(data);
    });
    setTexts();

    socket.emit("joinRoom", clickedId);
  }, []);

  const onFinished = async (values: IFormData) => {
    // 입력한 채팅 공백 제거
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      await addDoc(collection(dbService, "messages"), {
        createdAt: Date.now(),
        email: "",
        uid: "",
        text: "",
        roomId: "",
      });

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
            {clickedId === "group" ? "그룹대화" : { clickedId } + "님과의 대화"}
          </title>
        </Head>

        <ContentWrapper>
          <div>
            {clickedId === "group" ? "그룹대화" : { clickedId } + "님과의 대화"}
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

export default Chat;
