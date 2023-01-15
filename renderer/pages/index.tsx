import { Header } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Nav from "../components/Header";
import { auth } from "../firebase";

import Home from "./home";
const SignOut = dynamic(() => import("../components/SignOut"), { ssr: false });

function Index() {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Home />
    </React.Fragment>
  );
}

export default Index;
