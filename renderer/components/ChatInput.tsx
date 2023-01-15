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
          <FormItem name="text">
            <Input
              className="flex_item1"
              size="large"
              value={newMessage}
              onChange={handleOnChange}
              placeholder="메시지를 입력하세요."
            />
          </FormItem>

          <FormItem>
            <Button
              className="flex_item2"
              size="large"
              type="primary"
              htmlType="submit"
              disabled={newMessage ? false : true}
            >
              전송
            </Button>
          </FormItem>
        </FormWrapper>
      </Form>
    </React.Fragment>
  );
}
const FormWrapper = styled.footer`
  display: flex;
  flex: auto;
  position: fixed;
  width: 100vw;
  bottom: 0;
  z-index: 99;
  .ant-form-item {
    margin: 0px;
    padding: 0px;
  }
  .ant-input {
    border: none;
    padding: 20px;
    width: 90vw;
  }
  .ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    width: 10vw;
    background-color: #ffe731;
    border: none;
    color: #1a1a1a;
  }
`;

export default ChatInput;
