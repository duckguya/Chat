import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { auth, dbService } from "../firebase";
import Cookies from "universal-cookie";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { ipcRenderer } from "electron";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const Sign = dynamic(() => import("../components/Sign"), { ssr: false });
interface IFormData {
  email: string;
  password: string;
  passwordConfirm?: string;
}

function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload.length > 0) router.push("/room");
    });
  }, []);

  const handleModalClick = (type: boolean) => {
    setIsSignUp(type);
    // router.push("/signup");
  };

  const handleSubmit = async (values: IFormData) => {
    try {
      ipcRenderer.send("SIGN_UP", values);
      // const newUser = await createUserWithEmailAndPassword(
      //   auth,
      //   values.email,
      //   values.password
      // );
      // await addDoc(collection(dbService, "users"), {
      //   email: values.email,
      //   createdAt: Date.now(),
      //   uid: newUser.user.uid,
      // });
      // auth.currentUser.getIdToken().then(function (idToken) {
      //   ipcRenderer.send("SIGN_IN", { idToken, uid: auth.currentUser.uid });
      //   ipcRenderer.on("TOKEN", (evnet, payload) => {
      //     if (payload) {
      //       router.push("/room");
      //     }
      //   });
      // });
      ipcRenderer.on("TOKEN", (evnet, payload) => {
        if (payload) {
          router.push("/room");
        }
      });
      // showModal();
    } catch (error) {
      alert("이미 존재하는 이메일입니다.");
      console.log("error: ", error.message);
    }
  };
  return (
    <React.Fragment>
      <Head children={""}>
        <title>sign in</title>
      </Head>
      {!isSignUp ? (
        <>
          <Sign isSignIn={true} />
          <a onClick={() => handleModalClick(true)}>회원가입</a>
        </>
      ) : (
        <>
          <Sign isSignIn={false} handleSubmit={handleSubmit} />
          <a onClick={() => handleModalClick(false)}>로그인</a>
        </>
      )}
    </React.Fragment>
  );
}

export default Home;
