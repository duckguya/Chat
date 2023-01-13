import React, { useEffect } from "react";
import Head from "next/head";
import { Button } from "antd";
import styled from "styled-components";
import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
import router from "next/router";
import Cookies from "universal-cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms";
import { auth } from "../firebase";

const SignOut = () => {
  const cookies = new Cookies();
  const [isUser, setIsUser] = useRecoilState(userAtom);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUser(true);
      }
    });
  }, []);

  const onClicked = async () => {
    try {
      await auth.signOut();
      setIsUser(false);
      router.push("/home");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <React.Fragment>
      {isUser && (
        <Button
          size="small"
          type="primary"
          style={{ width: "10%" }}
          onClick={onClicked}
        >
          로그아웃
        </Button>
      )}
    </React.Fragment>
  );
};

export default SignOut;
