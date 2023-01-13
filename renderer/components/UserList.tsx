import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/skeleton/Title";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { clickedIdAtom } from "../atoms";
import Head from "next/head";
import { ipcRenderer } from "electron";
import { auth, dbService } from "../firebase";
import React from "react";

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
  const setClickId = useSetRecoilState(clickedIdAtom);
  const router = useRouter();

  const getUsers = async () => {
    try {
      setUsers([]);
      const q = query(
        collection(dbService, "users"),
        where("uid", "!=", auth.currentUser.uid)
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
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onClicked = (type: string) => {
    setClickId(type);
    router.push("/chat");
  };

  return (
    <React.Fragment>
      <Container>
        <Head children={""}>
          <title>유저 리스트</title>
        </Head>
        <Button onClick={() => onClicked("group")}>그룹채팅</Button>

        {users.map((d, index) => (
          <Button
            block
            key={index}
            style={{
              margin: "10px",
            }}
            onClick={() => onClicked(d.email)} //email:유니크
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
