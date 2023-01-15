import { Header } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms";
import { auth } from "../firebase";

const SignOut = dynamic(() => import("../components/SignOut"), { ssr: false });

function Nav() {
  const [isLogin, setIsLogin] = useRecoilState(userAtom);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("??");
        setIsLogin(true);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Header>
        {isLogin && (
          <>
            <Link href="/room">
              <a style={{ padding: "0 10px" }}>room</a>
            </Link>
            <SignOut />
          </>
        )}
      </Header>
    </React.Fragment>
  );
}

export default Nav;
