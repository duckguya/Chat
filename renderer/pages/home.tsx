import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Form, Select, Button, Modal } from "antd";
import Sign from "../components/Sign";
import store from "store"; /// store : local storage
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { async } from "@firebase/util";
import SignUp from "./signup";

// IPC는 on을 통해 메시지 또는 이벤트를 수신하고 send를 통해 메시지 또는 이벤트를 전달한다.
const { Header, Content } = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

// const USERS = [
//   { userId: "use1@gmail.com", password: "123123" },
//   { userId: "use2@gmail.com", password: "123123" },
//   { userId: "use3@gmail.com", password: "123123" },
// ];

function Home() {
  const router = useRouter();

  useEffect(() => {
    store.remove("user");
    // store.set("user", USERS);
  });

  useEffect(() => {
    const token = store.get("authorization");
    if (token) {
      ipcRenderer.send("FIRST_CONNECTION", { token });
      ipcRenderer.on("FIRST_CONNECTION", (evt, payload) => {
        if (payload) router.push("/list");
      });
    }
  }, []);

  const handleModalClick = () => {
    // setIsModalOpen(true);
    router.push("/signup");
  };
  return (
    <React.Fragment>
      <Head children={""}>
        <title>sign in</title>
      </Head>

      <Sign isSignIn={true} />

      <a onClick={handleModalClick}>회원가입</a>
    </React.Fragment>
  );
}

export default Home;
