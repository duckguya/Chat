import React, { useEffect, useState } from "react";
import Head from "next/head";
import UserList from "../components/UserList";

function Room() {
  return (
    <React.Fragment>
      <UserList />
    </React.Fragment>
  );
}
export default Room;
