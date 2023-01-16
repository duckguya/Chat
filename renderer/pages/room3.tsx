import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Content } from "antd/lib/layout/layout";
import { store } from "store";
import { useRouter } from "next/router";
import UserList from "../components/UserList";
import { Button } from "antd";
import { ipcRenderer } from "electron";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { dbService } from "../firebase";

const index = (props) => {
  if (props) {
    console.log("props", props);
    return <UserList {...props} />;
  }
};

export const getUsers = async () => {
  console.log("hihi");
  // const [userDatas, setUserDatas] = useState([]);
  const [userId, setUserId] = useState("");
  const [connection, setConnection] = useState(false);
  ipcRenderer.send("CONNECTION");
  ipcRenderer.on("CONNECTION", (event, payload) => {
    console.log("pp", payload);
    setUserId(payload);
  });

  console.log(connection);
  console.log(userId);

  setConnection(true);
  if (userId.length > 0) {
    console.log(1);
    const q = query(collection(dbService, "users"), where("uid", "!=", userId));
    onSnapshot(q, (querySnapshot) => {
      let userData = [];
      querySnapshot.forEach((doc) => {
        const userObj = {
          ...doc.data(),
          id: doc.id,
        };
        userData.push(userObj);
      });
      console.log(userData);
      return { data: userData };
      // setUserDatas(userData);
    });
  } else {
    console.log("여길 한 번 들리나?");
  }
};

export default index;

// function Room() {
//   const [userDatas, setUserDatas] = useState([]);
//   const [userId, setUserId] = useState("");

// const getUsers = async () => {
//   console.log("userId", userId);
//   if (userId !== "") {
//     console.log("3", userId);
//     console.log("userId", userId);
//     const q = query(
//       collection(dbService, "users"),
//       where("uid", "!=", userId)
//     );
//     console.log("userId", userId);
//     onSnapshot(q, (querySnapshot) => {
//       let userData = [];
//       querySnapshot.forEach((doc) => {
//         const userObj = {
//           ...doc.data(),
//           id: doc.id,
//         };
//         userData.push(userObj);
//       });
//       setUserDatas(userData);
//     });
//   } else {
//     // router.push("/");
//   }
// };

// useEffect(() => {
//   ipcRenderer.send("CONNECTION");
//   ipcRenderer.on("CONNECTION", (event, isUser) => {
//     if (isUser) {
//       console.log(1);
//       ipcRenderer.send("PROFILE");
//       ipcRenderer.on("PROFILE_UID", (evnet, payload) => {
//         console.log(2);
//         console.log("room: ", payload);
//         if (payload !== "") {
//           console.log(3);
//           setUserId(payload);
//           getUsers();
//         }
//       });
//     } else {
//       console.log("여길 한 번 들리나?");
//     }
//   });
// }, []);

//   return (
//     <React.Fragment>
//       {/* <Head> */}
//       {/* <title>room</title> */}
//       {/* </Head> */}
//       <Content>{userDatas && <UserList users={userDatas} />}</Content>
//     </React.Fragment>
//   );
// }
// export default Room;
