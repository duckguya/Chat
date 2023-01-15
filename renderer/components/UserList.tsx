import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/skeleton/Title";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { roomIdAtom } from "../atoms";
import Head from "next/head";
import { ipcRenderer } from "electron";
import { auth, dbService } from "../firebase";
import React from "react";
import Cookies from "universal-cookie";

interface UserList {
  userId: string;
  password: string;
}

interface Props {
  userInfo: UserList[];
  onClick: (item: string) => void;
  userId: string;
}

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState("false");
  const setRoomId = useSetRecoilState(roomIdAtom);
  const router = useRouter();

  const getUsers = async () => {
    ipcRenderer.send("PROFILE");
    console.log(1);
    ipcRenderer.on("PROFILE", (evnet, payload) => {
      console.log(2);
      console.log("????", payload);
      if (payload) {
        setUid(payload);
      }
    });

    if (uid !== "false") {
      try {
        setUsers([]);
        const q = query(
          collection(dbService, "users"),
          where("uid", "!=", uid)
        );
        const querySnapshot = await getDocs(q);
        let userData = [];
        querySnapshot.forEach((doc) => {
          const userObj = {
            ...doc.data(),
            id: doc.id,
          };
          userData.push(userObj);
        });
        setUsers(userData);
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    console.log("anjsi");
    getUsers();
  }, []);

  interface onClickedData {
    type: string;
    uid?: string;
  }
  const onClicked = ({ type, uid }: onClickedData) => {
    setRoomId(type);
    router.push(`/chats/${uid}`);
  };

  return (
    <React.Fragment>
      <Container>
        <Head children={""}>
          <title>유저 리스트</title>
        </Head>
        <Button onClick={() => onClicked({ type: "group" })}>그룹채팅</Button>

        {users.map((d, index) => (
          <Button
            block
            key={index}
            style={{
              margin: "10px",
            }}
            onClick={() => onClicked({ type: d.email, uid: d.uid })}
          >
            {d.email}
          </Button>
        ))}
      </Container>
    </React.Fragment>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default UserList;
