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
      // setUsers([]);
      // const q = query(collection(dbService, "users"));
      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   const userObj = {
      //     ...doc.data(),
      //     id: doc.id,
      //   };
      //   console.log(userObj);
      //   setUsers((prev) => [userObj, ...prev]);
      // });
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
          onClick={() => onClicked(d.email)}
        >
          {d.email}
        </Button>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default UserList;
