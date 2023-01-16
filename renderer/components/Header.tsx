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
  const cookies = new Cookies();
  const [token, setToken] = useState(false);
  useEffect(() => {
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload) {
        setToken(true);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Header>
        {token && (
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
