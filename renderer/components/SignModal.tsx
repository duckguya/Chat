import { ipcRenderer } from "electron";
import store from "store";
import { Modal } from "antd";
import Sign from "./Sign";
import styled from "styled-components";

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
  const storeInput = (userId, password) => {
    const userInfo = {};
    userInfo[userId] = password;
    store.set("user", userInfo);
  };
  const handleSubmit = (values: IFormData) => {
    const userEmail = values.email;
    const password = values.password;
    const passwordConfirm = values.passwordConfirm;

    if (password !== passwordConfirm) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    console.log(userEmail, password, passwordConfirm);
    // ipcRenderer.send("SIGN_UP", [userEmail, password]);
    // storeInput(userEmail, password);
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
