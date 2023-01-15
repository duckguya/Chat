import { Button, Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import React from "react";
import styled from "styled-components";

interface IProps {
  onFinished: (data) => void;
  handleOnChange: (data) => void;
  newMessage: string;
}
function ChatInput({ newMessage, onFinished, handleOnChange }: IProps) {
  return (
    <React.Fragment>
      {/* onSubmit={(e) => e.preventDefault()} */}
      <Form onFinish={onFinished}>
        <FormWrapper>
          <FormItem name="text" style={{ width: "80%" }}>
            <Input
              size="large"
              value={newMessage}
              onChange={handleOnChange}
              placeholder="메시지를 입력하세요."
            />
          </FormItem>

          <FormItem>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              disabled={newMessage ? false : true}
            >
              send
            </Button>
          </FormItem>
        </FormWrapper>
      </Form>
    </React.Fragment>
  );
}
const FormWrapper = styled.div`
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
export default ChatInput;
