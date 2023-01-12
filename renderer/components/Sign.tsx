import React, { ChangeEvent, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Form, Select, Button, Input } from "antd";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { ipcRenderer } from "electron";
import store from "store";
import router from "next/router";
import Cookies from "universal-cookie";
import axios from "axios";

const { Header, Content } = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

interface IFormData {
  email: string;
  password: string;
  passwordConfirm?: string;
}

interface IProps {
  isSignIn: boolean;
  handleSubmit?: (data) => void;
}
const Sign = ({ handleSubmit, isSignIn }: IProps) => {
  const [password, setPassword] = useState("");
  const [passCheck, setPassCheck] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const onFinish = async (values: IFormData) => {
    if (!passCheck) {
      return setPassCheck(false);
    } else {
      if (!isSignIn) {
        handleSubmit(values);
      }
      try {
        // const userInfo = await signInWithEmailAndPassword(
        //   auth,
        //   values.email,
        //   values.password
        // );
        const userInfo = { email: values.email, password: values.password };
        ipcRenderer.send("SIGN_IN", userInfo);
        ipcRenderer.on(
          "TOKEN",
          (event, payload: { accessToken: string; refreshToken: string }) => {
            const cookies = new Cookies();
            cookies.set("chat-access-token", payload.accessToken);
            if (window.location.pathname === "/home") {
              router.push("/room");
            } else [router.reload()];
          }
        );

        // localStorage.setItem("user", JSON.stringify(userInfo));

        // userInfo.user.getIdToken().then(function (idToken) {
        //   ipcRenderer.send("TOKEN", {
        //     accessToken: idToken,
        //     refreshToken: userInfo.user.refreshToken,
        //   });
        // });

        router.push("/room");
      } catch (error) {
        ipcRenderer.send("SIGN_IN", false);
        setIsLogin(false);
        console.log(error);
      }
    }
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };
  const handlePasswordCheck = (event: ChangeEvent<HTMLInputElement>) => {
    const passwordConfirm = event.currentTarget.value;
    if (password === passwordConfirm) setPassCheck(true);
    else setPassCheck(false);
  };

  return (
    <React.Fragment>
      <Head children={""}>
        <title>sign in</title>
      </Head>

      <Content style={{ padding: 48 }}>
        <p component="h1" variant="h5">
          {isSignIn ? "Sign In" : "Sign Up"}
        </p>
        <Form
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <FormItem
            label="이메일"
            name="email"
            rules={[
              { required: true, message: "이메일을 입력해주세요." },
              {
                type: "email",
                message: "이메일 형식으로 입력해주세요.",
              },
            ]}
          >
            <Input size="large" style={{ width: "100%" }} />
          </FormItem>

          <FormItem
            label="비밀번호"
            name="password"
            rules={[
              {
                required: true,
                message: "최소 6자 이상 입력해주세요.",
                min: 6,
              },
            ]}
          >
            <Input.Password
              size="large"
              style={{ width: "100%" }}
              onChange={handlePasswordChange}
            />
          </FormItem>
          {!isLogin && isSignIn && (
            <FlagMessage>이메일과 비밀번호를 확인해주세요.</FlagMessage>
          )}

          {!isSignIn && (
            <>
              <FormItem
                label="비밀번호 확인"
                name="passwordConfirm"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  style={{ width: "100%" }}
                  onChange={handlePasswordCheck}
                />
              </FormItem>
              {!passCheck && (
                <FlagMessage>비밀번호가 일치하지 않습니다.</FlagMessage>
              )}
            </>
          )}

          <FormItem
            style={{ marginTop: 48 }}
            wrapperCol={{ span: 14, offset: 5 }}
          >
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
            >
              {isSignIn ? "로그인" : "회원가입"}
            </Button>
          </FormItem>
        </Form>
      </Content>
    </React.Fragment>
  );
};
const FlagMessage = styled.p`
  color: tomato;
  display: flex;
  justify-content: center;
`;
export default Sign;
