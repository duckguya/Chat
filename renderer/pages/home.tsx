import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import Cookies from "universal-cookie";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { ipcRenderer } from "electron";

const Sign = dynamic(() => import("../components/Sign"), { ssr: false });

function Home() {
  const router = useRouter();

  useEffect(() => {
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload) router.push("/room");
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
