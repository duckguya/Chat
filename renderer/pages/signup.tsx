import { ipcRenderer } from "electron";
import store from "store";
import { Modal } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Sign from "../components/Sign";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, dbService } from "../firebase";

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

const SignUp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: IFormData) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await addDoc(collection(dbService, "users"), {
        email: values.email,
        createdAt: Date.now(),
      });
      showModal();
    } catch (error) {
      console.log("error: ", error);
    }
    // ipcRenderer.send("SIGN_UP", userInfo);
    // ipcRenderer.on("SIGN_UP_STATE", (event, payload) => {
    //   if (payload.message === "ok") {
    //     showModal();
    //   } else {
    //     alert("error");
    //   }
    // });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    router.push("/home");

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    router.push("/home");
    setIsModalOpen(false);
  };
  return (
    <>
      <Sign isSignIn={false} handleSubmit={handleSubmit} />
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        회원가입이 완료되었습니다. 로그인페이지로 이동합니다.
      </Modal>
    </>
  );
};
const FlagMessage = styled.p`
  color: tomato;
  display: flex;
  justify-content: center;
`;
export default SignUp;
