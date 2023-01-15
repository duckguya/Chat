import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Form, Select, Button, Modal } from "antd";
// import Sign from "../components/Sign";
import store from "store"; /// store : local storage
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { async } from "@firebase/util";
import SignUp from "./signup";
import Cookies from "universal-cookie";
import { auth } from "../firebase";

import type { NextPage } from "next";
import dynamic from "next/dynamic";
const Sign = dynamic(() => import("../components/Sign"), { ssr: false });

function Home() {
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/room");
      }
    });
  }, []);

  const handleModalClick = () => {
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
