import { Header } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

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
      <Header style={{ position: "fixed", width: "100%", zIndex: 99 }}>
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
