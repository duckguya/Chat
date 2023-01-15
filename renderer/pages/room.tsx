import React, { useState } from "react";
import Head from "next/head";
import { Content } from "antd/lib/layout/layout";
import { store } from "store";
import { useRouter } from "next/router";
import UserList from "../components/UserList";
import { Button } from "antd";
import { ipcRenderer } from "electron";

function Room() {
  return (
    <React.Fragment>
      {/* <Head> */}
      {/* <title>room</title> */}
      {/* </Head> */}
      <Content>
        <UserList />
      </Content>
    </React.Fragment>
  );
}
export default Room;
