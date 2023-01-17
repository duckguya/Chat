import React, { useEffect, useState } from "react";
import { Button } from "antd";
import router from "next/router";
import Cookies from "universal-cookie";
import { ipcRenderer } from "electron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";

const SignOut = () => {
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);

  const onClicked = async () => {
    try {
      // cookies.remove("chat-access-token", { path: "/" });
      // await auth.signOut();
      ipcRenderer.send("REMOVE_TOKEN");
      ipcRenderer.on("REMOVE_TOKEN", (event, payload) => {
        if (payload) {
          setIsLogin(false);
          router.push("/");
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <React.Fragment>
      {/* {isUser && ( */}

      <FontAwesomeIcon
        onClick={onClicked}
        icon={faSignOut}
        color={"white"}
        size="1x"
        style={{ cursor: "pointer" }}
      />
      {/* )} */}
    </React.Fragment>
  );
};

export default SignOut;
