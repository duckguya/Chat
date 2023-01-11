import React, { useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Header } from "antd/lib/layout/layout";
import Link from "next/link";

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import { auth } from "../firebase";
import SignOut from "../components/SignOut";
import { setPersistence } from "firebase/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head children={""}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header>
        {/* <Link href="/home">
          <a style={{ padding: "0 10px" }}>home</a>
        </Link> */}
        {auth.currentUser && <SignOut />}
      </Header>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
