import React, { useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Header } from "antd/lib/layout/layout";
import Link from "next/link";
import { RecoilRoot } from "recoil";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
// import SignOut from "../components/SignOut";
import Cookies from "universal-cookie";
import styled from "styled-components";
// axios.defaults.baseURL = "https://localhost:8888";
// axios.defaults.withCredentials = true;
import dynamic from "next/dynamic";
import { auth } from "../firebase";
import Nav from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  const cookies = new Cookies();

  return (
    <React.Fragment>
      <Head children={""}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RecoilRoot children={""}>
        <Nav />
        <Component {...pageProps} />
      </RecoilRoot>
    </React.Fragment>
  );
}

export default MyApp;
