import React from "react";
import styled from "styled-components";
import { auth } from "../firebase";
interface IProps {
  id: string;
  author: string;
  createdAt: string;
  rooms: [string[]];
  text: string;
}
function Messages(data: IProps) {
  console.log("data", data);
  return (
    <React.Fragment>
      <Container>
        {data.author !== auth.currentUser.uid ? (
          <TheOtherPersonText>{data.text}</TheOtherPersonText>
        ) : (
          <MyText>{data.text}</MyText>
        )}
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  background-color: #eee;
`;
const TextBox = styled.div`
  border: none;
  padding: 10px;
  border-radius: 15px;
`;
const TheOtherPersonText = styled(TextBox)`
  background-color: white;
`;
const MyText = styled(TextBox)`
  background-color: #ffe731;
`;

export default Messages;
