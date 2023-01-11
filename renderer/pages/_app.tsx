import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { Header } from "antd/lib/layout/layout";
import Link from "next/link";

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

function MyApp({ Component, pageProps }: AppProps) {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };

  return (
    <React.Fragment>
      <Head children={""}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header>
        <Link href="/home">
          <a style={{ padding: "0 10px" }}>home</a>
        </Link>
      </Header>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
