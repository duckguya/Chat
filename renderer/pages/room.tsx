import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Content } from "antd/lib/layout/layout";
import { store } from "store";
import { useRouter } from "next/router";
import UserList from "../components/UserList";
import { Button } from "antd";
import { ipcRenderer } from "electron";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { dbService } from "../firebase";

function Room() {
  const [userDatas, setUserDatas] = useState([]);
  const [userId, setUserId] = useState("");

  // useEffect(() => {
  //   ipcRenderer.send("USER_LIST");
  //   ipcRenderer.on("USER_LIST", (event, userList) => {
  //     console.log("userList", userList);
  //   });
  // }, []);

  return (
    <React.Fragment>
      {/* <Head> */}
      {/* <title>room</title> */}
      {/* </Head> */}
      <UserList />
    </React.Fragment>
  );
}
export default Room;
