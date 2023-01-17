import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import { RecoilRoot } from "recoil";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import Nav from "../components/Header";
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { createGlobalStyle, styled } from "styled-components";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
border: 0;
font-size: 100%;
font: inherit;
vertical-align: baseline;
&::-webkit-scrollbar {
    display: none;
  }
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
display: block;
}
body {
line-height: 1;
}
ol, ul {
list-style: none;
}
blockquote, q {
quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
content: '';
content: none;
}
table {
border-collapse: collapse;
border-spacing: 0;
}
/*  */
*{
  box-sizing: border-box;
}
body{
  /* google font  */
  font-family: 'Source Sans Pro', sans-serif;
}
a{
  text-decoration: none;
  color:inherit;
}
`;

function MyApp({ Component, pageProps }: AppProps) {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (evnet, payload) => {
      if (payload.length == 0) {
        setIsLogin(false);
        router.push("/");
      } else {
        setIsLogin(true);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <Head children={""}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RecoilRoot children={""}>
        <GlobalStyle />
        <Nav />
        <div style={{ paddingTop: "37px" }}>
          <Component {...pageProps} />
        </div>
      </RecoilRoot>
    </React.Fragment>
  );
}

export default MyApp;
