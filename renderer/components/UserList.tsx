import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { roomIdAtom } from "../atoms";
import Head from "next/head";
import { ipcRenderer } from "electron";
import React from "react";

interface UserList {
  uid: string;
  id: string;
  email: string;
  createdAt: number;
}
interface IProps {
  // children?: React.ReactFragment;
  users: UserList[];
}

const UserList = () => {
  const setRoomId = useSetRecoilState(roomIdAtom);
  const router = useRouter();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    ipcRenderer.send("USER_LIST");
    ipcRenderer.on("USER_LIST", (event, payload) => {
      setUserList([...payload]);
    });
  }, []);

  interface onClickedData {
    type: string;
    uid?: string;
  }
  const onClicked = ({ type, uid }: onClickedData) => {
    setRoomId(type);
    localStorage.removeItem("roomUserUid");
    localStorage.setItem("roomUserUid", uid);
    router.push(`/chats/${uid}`);
  };

  return (
    <React.Fragment>
      <Container>
        <Head children={""}>
          <title>유저 리스트</title>
        </Head>
        <Button onClick={() => onClicked({ type: "group" })}>그룹채팅</Button>

        {userList &&
          userList.map((data, index) => (
            <Button
              // block
              key={index}
              onClick={() => onClicked({ type: data.email, uid: data.uid })}
            >
              {data.email}
            </Button>
          ))}
      </Container>
    </React.Fragment>
  );
};

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  .ant-btn {
    max-width: 50%;
    margin: 10px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    &:hover {
      border-color: #ffd220;
      color: #ffd220;
    }
  }
`;

export default UserList;
