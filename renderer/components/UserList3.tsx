import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/skeleton/Title";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
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

// interface UserList {
//   userId: string;
//   password: string;
// }

// interface Props {
//   userInfo: UserList[];
//   onClick: (item: string) => void;
//   userId: string;
// }
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

const UserList2 = (props) => {
  const { data } = props;
  console.log(props);
  console.log(data);
  // const [users, setUsers] = useState(datas);
  const [uid, setUid] = useState("false");
  const setRoomId = useSetRecoilState(roomIdAtom);
  const router = useRouter();

  // const getUsers = async () => {
  //   ipcRenderer.send("PROFILE");
  //   ipcRenderer.on("PROFILE", (evnet, payload) => {
  //     if (payload !== "") {
  //       setUid(payload);
  //     }
  //   });

  //   if (uid !== "false") {
  //     try {
  //       console.log(1);
  //       const q = query(
  //         collection(dbService, "users"),
  //         where("uid", "!=", uid)
  //       );
  //       console.log(2);
  //       onSnapshot(q, (querySnapshot) => {
  //         console.log(3);
  //         let userData = [];
  //         querySnapshot.forEach((doc) => {
  //           console.log(4);
  //           const userObj = {
  //             ...doc.data(),
  //             id: doc.id,
  //           };
  //           userData.push(userObj);
  //           console.log(5);
  //         });
  //         console.log(userData);
  //         setUsers(userData);
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     // router.push("/");
  //   }
  // };
  // useEffect(() => {
  //   console.log("here 1");
  //   ipcRenderer.send("CONNECTION");
  //   ipcRenderer.on("CONNECTION", (event, isUser) => {
  //     console.log("here 2");
  //     if (isUser) {
  //       console.log("here 3");
  //       getUsers();
  //     } else {
  //       console.log("여길 한 번 들리나?");
  //       router.push("/");
  //     }
  //   });
  // }, []);

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

        {/* {users &&
          users.map((data, index) => (
            <>
              {console.log("data!!", data)}
              <Button
                block
                key={index}
                style={{
                  margin: "10px",
                }}
                onClick={() => onClicked({ type: data.email, uid: data.uid })}
              >
                {data.email}
              </Button>
            </>
          ))} */}
      </Container>
    </React.Fragment>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default UserList2;
