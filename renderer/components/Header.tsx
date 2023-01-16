import { Header } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { auth } from "../firebase";
import Cookies from "universal-cookie";
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";

const SignOut = dynamic(() => import("../components/SignOut"), { ssr: false });

function Nav() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload.length > 0) {
        setIsVisible(true);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Header>
        {isVisible && (
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
