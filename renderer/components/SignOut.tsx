import React from "react";
import Head from "next/head";
import { Button } from "antd";
import styled from "styled-components";
import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
import router from "next/router";

const SignOut = () => {
  const onClicked = () => {
    // signOut('auth');
    router.push("/home");
  };

  return (
    <React.Fragment>
      <Head children={""}>
        <title>sign out</title>
      </Head>

      <Button
        size="small"
        type="primary"
        style={{ width: "10%" }}
        onClick={onClicked}
      >
        로그아웃
      </Button>
    </React.Fragment>
  );
};

export default SignOut;
