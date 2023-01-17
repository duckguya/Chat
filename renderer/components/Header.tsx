// import { Header } from "antd/lib/layout/layout";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginAtom } from "../atoms";

const SignOut = dynamic(() => import("../components/SignOut"), { ssr: false });

interface IProps {
  isLogin: boolean;
}
function Nav() {
  // const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);

  useEffect(() => {
    console.log("header!");
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload.length > 0) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, [isLogin]);

  return (
    <React.Fragment>
      <Container>
        {isLogin && (
          <Header>
            <Link href="/room">
              <a>
                <FontAwesomeIcon icon={faHome} color={"white"} size="1x" />
              </a>
            </Link>
            <SignOut />
          </Header>
        )}
      </Container>
    </React.Fragment>
  );
}
const Container = styled.div`
  .ant-layout-header {
    z-index: 99;
    position: fixed;
    width: 100%;
    /* height: 40px; */
  }
`;

const Header = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: #88aab1;
  z-index: 99;
  padding: 0 30px;
`;

export default Nav;
