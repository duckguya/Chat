import { Header } from "antd/lib/layout/layout";
import { ipcRenderer } from "electron";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Nav from "../components/Header";
import { auth } from "../firebase";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import Home from "./home";
const SignOut = dynamic(() => import("../components/SignOut"), { ssr: false });

function Index() {
  const router = useRouter();

  return (
    <React.Fragment>
      <Home />
    </React.Fragment>
  );
}

export default Index;
