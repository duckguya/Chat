import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loginUserInfoAtom, roomIdAtom, roomTypeAtom } from "../atoms";
import Head from "next/head";
import { ipcRenderer } from "electron";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

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
interface IUser {
  uid: string;
  email: string;
  createdAt: number;
}
const UserList = () => {
  const setRoomType = useSetRecoilState(roomTypeAtom);
  const router = useRouter();
  const [userList, setUserList] = useState([]);

  const [loginInfo, setLoginInfo] = useRecoilState(loginUserInfoAtom);
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);

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
    setRoomType(type);

    localStorage.removeItem("roomUserUid");
    localStorage.setItem("roomUserUid", uid);

    ipcRenderer.send("PROFILE");
    let sortedIds = "group";
    let userUid;
    ipcRenderer.on("PROFILE_UID", async (event, userInfo) => {
      if (userInfo.uid !== "") {
        userUid = userInfo.uid;
        setLoginInfo(userInfo);
      } else {
        console.log("");
      }
    });

    if (type !== "group") {
      const ids = [loginInfo.uid, uid];
      sortedIds = ids.sort()[0] + ids.sort()[1];
    }
    localStorage.setItem("roomId", sortedIds);
    setRoomId(sortedIds);
    router.push(`/chats/${uid}`);
  };

  return (
    <React.Fragment>
      <Container>
        <Head children={""}>
          <title>유저 리스트</title>
        </Head>
        <Button onClick={() => onClicked({ type: "group" })}>
          <span>그룹채팅</span>
          <FontAwesomeIcon
            icon={faArrowRightToBracket}
            color={"#88aab1"}
            size="1x"
          />
        </Button>

        {userList &&
          userList.map((data, index) => (
            <Button
              // block
              key={index}
              onClick={() => onClicked({ type: data.email, uid: data.uid })}
            >
              <span>{data.email}</span>
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                color={"#88aab1"}
                size="1x"
              />
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
    width: 300px;
    margin: 10px;
    padding: 20px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    &:hover {
      border-color: #88aab1;
      color: #88aab1;
    }
  }
`;

export default UserList;
