import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/skeleton/Title";
import { auth, dbService } from "../firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { useRouter } from "next/router";

interface UserList {
  userId: string;
  password: string;
}

interface Props {
  userInfo: UserList[];
  onClick: (item: string) => void;
  userId: string;
}

const UserList = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const getUsers = async () => {
    try {
      setUsers([]);
      const q = query(collection(dbService, "users"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userObj = {
          ...doc.data(),
          id: doc.id,
        };
        console.log(userObj);
        setUsers((prev) => [userObj, ...prev]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onClicked = (email: string) => {
    router.push("/chat");
  };

  return (
    <Container>
      {users.map((d, index) => (
        <Button
          block
          key={index}
          style={{
            margin: "10px",
          }}
          onClick={() => onClicked(d.email)}
        >
          {d.email}
        </Button>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default UserList;
