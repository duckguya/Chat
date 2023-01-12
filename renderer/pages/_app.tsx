import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Header } from "antd/lib/layout/layout";
import Link from "next/link";
import { RecoilRoot } from "recoil";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import SignOut from "../components/SignOut";
import { setPersistence } from "firebase/auth";
import Cookies from "universal-cookie";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:8888";
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("chat-access-token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  }, []);
  return (
    <RecoilRoot>
      <React.Fragment>
        <Head children={""}>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header>
          <Link href="/room">
            <a style={{ padding: "0 10px" }}>room</a>
          </Link>
          <Link href="/home">
            <a style={{ padding: "0 10px" }}>home</a>
          </Link>
          {"auth.currentUser" && <SignOut />}
        </Header>

        <Component {...pageProps} />
      </React.Fragment>
    </RecoilRoot>
  );
}

export default MyApp;
