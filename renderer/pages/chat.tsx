import { Content } from "antd/lib/layout/layout";
import { useRecoilState } from "recoil";
import { clickedIdAtom, textAtom } from "../atoms";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import styled from "styled-components";
import Head from "next/head";

const socket = io("http://localhost:3000");

interface IFormData {
  text: string;
}
interface ChatText {
  user: string;
  text: string;
}

function Chat() {
  const [form] = Form.useForm();
  const [clickedId, setClickId] = useRecoilState(clickedIdAtom);
  const [inputData, setInputData] = useRecoilState(textAtom);
  const [chatTexts, setChatTexts] = useState<ChatText[]>([]);

  const setTexts = () => {};

  const storageSetTexts = (data) => {};

  useEffect(() => {
    socket.on("message", function (data) {
      console.log("chat data", data);
      storageSetTexts(data);
    });
    setTexts();

    socket.emit("joinRoom", clickedId);
  }, []);

  const onFinished = async (values: IFormData) => {
    // socket.emit("message", {
    //   userId: auth.currentUser.email,
    //   clickedId,
    //   text: values.text,
    // });

    form.resetFields();
  };

  return (
    <Container>
      <Head children={""}>
        <title>{clickedId === "group" ? "그룹대화" : "님과의 대화"}</title>
      </Head>
      <div>{clickedId === "group" ? "그룹대화" : "님과의 대화"}</div>
      <ContentWrapper>
        <div>대화내용</div>
      </ContentWrapper>
      <Form onFinish={onFinished}>
        <FormWrapper>
          <FormItem
            name="text"
            rules={[{ required: true, message: "메시지를 입력해주세요." }]}
            style={{ width: "80%" }}
          >
            <Input size="large" />
          </FormItem>

          <FormItem>
            <Button size="large" type="primary" htmlType="submit">
              send
            </Button>
          </FormItem>
        </FormWrapper>
      </Form>
    </Container>
  );
}
const Container = styled.div`
  padding: 20px;
  height: 90vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ContentWrapper = styled.div`
  overflow: scroll;
`;
const FormWrapper = styled.form`
  display: flex;
  justify-content: space-between;
`;

const TextField = styled.input`
  width: 80vw;
  padding: 10px;
  border-radius: 10px;
`;
const SendButton = styled.button`
  border-radius: 10px;
  border: 1px solid gray;
  background-color: white;
  padding: 10px;
`;

export default Chat;
