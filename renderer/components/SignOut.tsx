import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button } from "antd";
import styled from "styled-components";
import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
import router from "next/router";
import Cookies from "universal-cookie";
import { useRecoilState } from "recoil";
import { auth } from "../firebase";
import { ipcRenderer } from "electron";

const SignOut = () => {
  const cookies = new Cookies();

  const onClicked = async () => {
    try {
      // cookies.remove("chat-access-token", { path: "/" });
      // await auth.signOut();
      ipcRenderer.send("REMOVE_TOKEN");
      ipcRenderer.on("REMOVE_TOKEN", (event, payload) => {
        if (payload) {
          router.push("/");
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <React.Fragment>
      {/* {isUser && ( */}
      <Button
        size="small"
        type="primary"
        style={{ width: "10%" }}
        onClick={onClicked}
      >
        로그아웃
      </Button>
      {/* )} */}
    </React.Fragment>
  );
};

export default SignOut;
