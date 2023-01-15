import { Content } from "antd/lib/layout/layout";
import { useRecoilState } from "recoil";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import styled from "styled-components";
import Head from "next/head";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { roomIdAtom, textAtom } from "../../atoms";
import { auth, dbService } from "../../firebase";
import Messages from "../../components/Messages";
import ChatInput from "../../components/ChatInput";
import router from "next/router";

const socket = io("http://localhost:3000");

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
  const roomUserId = router.query.params[0] || "";
  const loginId = auth.currentUser.uid;

  const [roomType, setRoomType] = useRecoilState(roomIdAtom);
  const [roomId, setRoomId] = useState("");
  const [inputData, setInputData] = useRecoilState(textAtom);
  const [oldMessages, setOldMessages] = useState<IOldMessage[]>([]);
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
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const mObj = {
          ...doc.data(),
          id: doc.id,
        };
        msgList.push(mObj);
      });
      console.log(msgList);
      setOldMessages(msgList);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // 채팅방id 만들기
    const ids = [loginId, roomUserId];
    let sortedIds = ids.sort()[0] + ids.sort()[1];
    setRoomId(sortedIds);
    setTexts();
  }, []);

  //   전송 버튼을 누르고 데이터 저장
  const onFinished = async (values: IFormData) => {
    if (newMessage) {
      try {
        // Add new message in Firestore
        await addDoc(collection(dbService, `messages${roomId}`), {
          createdAt: Date.now(),
          author: loginId,
          text: values.text,
          rooms: [{ uid: [auth.currentUser.uid, roomUserId] }],
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
                <li key={index}>
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
  height: 90vh;
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
  background-color: white;
  border: none;
`;
