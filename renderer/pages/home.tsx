import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Form, Select, Button } from "antd";
import Sign from "../components/Sign";
import store from "store"; /// store : local storage
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import SignModal from "../components/SignModal";

// IPC는 on을 통해 메시지 또는 이벤트를 수신하고 send를 통해 메시지 또는 이벤트를 전달한다.
const { Header, Content } = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

const USERS = [
  { userId: "use1@gmail.com", password: "123123" },
  { userId: "use2@gmail.com", password: "123123" },
  { userId: "use3@gmail.com", password: "123123" },
];

interface IFormData {
  email: string;
  password: string;
  passwordConfirm?: string;
}

function Home() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    store.remove("user");
    store.set("user", USERS);
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

  const handleSubmit = (values: IFormData) => {
    // const data = new FormData(event.currentTarget);
    const userInfo = store.get("user");
    console.log("userInfo", userInfo);

    if (userInfo) {
      const email = String(values.email);
      ipcRenderer.send("SIGN_IN", { email });
      ipcRenderer.on("TOKEN", (evt, payload) => {
        console.log("payload", payload);
        const token = payload;
        console.log("token", token);
        store.set("authorization", token);
      });
      // router.push("/list");
    } else {
      setAlertOpen(true);
      ipcRenderer.send("SIGN_IN", false);
    }
  };
  const handleModalClose = () => setIsModalOpen(false);
  const handleOk = () => setIsModalOpen(false);
  const handleModalClick = () => {
    setIsModalOpen(true);
  };
  return (
    <React.Fragment>
      <Head children={""}>
        <title>sign in</title>
      </Head>

      <Sign handleSubmit={handleSubmit} isSignIn={true} />
      <a onClick={handleModalClick}>회원가입</a>
      <SignModal
        open={isModalOpen}
        handleOk={handleOk}
        handleClose={handleModalClose}
      />
    </React.Fragment>
  );
}

export default Home;
