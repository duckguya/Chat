import React, { ChangeEvent, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Form, Select, Button, Input } from "antd";
import styled from "styled-components";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ipcRenderer, session } from "electron";
import store from "store";
import router, { useRouter } from "next/router";
import Cookies from "universal-cookie";
import axios from "axios";
import { useRecoilState } from "recoil";
import { auth } from "../firebase";

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

  useEffect(() => {
    ipcRenderer.send("CONNECTION");
    ipcRenderer.on("CONNECTION", (event, payload) => {
      if (payload.length > 0) {
        router.push("/room");
      }
    });
  }, []);

  const onFinish = async (values: IFormData) => {
    if (!passCheck) {
      return setPassCheck(false);
    } else {
      if (!isSignIn) {
        // 회원가입이라면
        handleSubmit(values);
      } else {
        // 로그인이라면
        try {
          await signInWithEmailAndPassword(auth, values.email, values.password);
          // const cookies = new Cookies();
          auth.currentUser.getIdToken().then(function (idToken) {
            ipcRenderer.send("SIGN_IN", { idToken, uid: auth.currentUser.uid });
            ipcRenderer.on("TOKEN", (evnet, payload) => {
              if (payload) {
                router.push("/room");
              }
            });
          });
        } catch (error) {
          setIsLogin(false);
          console.log(error);
        }
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
