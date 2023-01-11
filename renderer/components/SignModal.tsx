import { ipcRenderer } from "electron";
import store from "store";
import { Modal } from "antd";
import Sign from "./Sign";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

interface Props {
  open: boolean;
  handleOk: () => void;
  handleClose: () => void;
}
interface IFormData {
  email: string;
  password: string;
  passwordConfirm?: string;
}

const SignModal = ({ open, handleOk, handleClose }: Props) => {
  const router = useRouter();

  const storeInput = (email, password) => {
    const userInfo = {};
    userInfo[email] = password;
    store.set("user", userInfo);
  };
  const handleSubmit = async (values: IFormData) => {
    const email = values.email;
    const password = values.password;

    ipcRenderer.send("SIGN_UP", [email, password]);
    storeInput(email, password);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/room");
    } catch (error) {
      console.log(error);
      router.push("/home");
    }
  };

  return (
    <div>
      <Modal open={open} onOk={handleOk} onCancel={handleClose} footer={null}>
        <Sign handleSubmit={handleSubmit} isSignIn={false} />
      </Modal>
    </div>
  );
};

export default SignModal;
