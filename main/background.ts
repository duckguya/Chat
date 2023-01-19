import { app, ipcMain, session } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { Server } from "socket.io";
import Cookies from "universal-cookie";
import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  getDocFromCache,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { auth, dbService } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// import {
// createUserWithEmailAndPassword,
// signInWithEmailAndPassword,
// } from "firebase/auth";
// import { auth, dbService } from "../renderer/firebase";
// import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
// const isProd: boolean = process.env.NODE_ENV === "development";
const isProd: boolean = process.env.NODE_ENV === "production";

// socket io
const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  // 접속한 클라이언트의 정보가 수신되면
  socket.on("joinRoom", function (data) {
    const roomId = data;
    // if (io.sockets.adapter.rooms.get(roomId))
    socket.join(roomId);
  });
  socket.on("message", function (data) {
    // 전체에 메시지 전송
    if (data.clickedId === "group") socket.emit("message", data);
    // 특정 클라이언트에게 메시지 전송
    else socket.to(data.clickedId).emit("message", data);
  });
});

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 768,
    height: 1024,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  }
})();

ipcMain.on("SIGN_UP", async (event, payload) => {
  const newUser = await createUserWithEmailAndPassword(
    auth,
    payload?.email,
    payload?.password
  );
  await addDoc(collection(dbService, "users"), {
    email: newUser?.user?.email,
    createdAt: Date.now(),
    uid: newUser?.user?.uid,
  });
  auth.currentUser.getIdToken().then(async function (idToken) {
    await session.defaultSession.cookies
      .set({
        url: "https://localhost:3000/*",
        name: "token",
        value: idToken,
        httpOnly: true, // client에서 쿠키 접근함을 방지하기위해 설정 ( 보안 설정 )
        // expirationDate: 10,
      })
      .then(() => {});
    await session.defaultSession.cookies
      .set({
        url: "https://localhost:3000/*",
        name: "uid",
        value: newUser?.user?.uid,
      })
      .then(() => {
        event.reply("TOKEN", true);
      });
  });
});

ipcMain.on("SIGN_IN", async (event, payload) => {
  try {
    await signInWithEmailAndPassword(auth, payload.email, payload.password);
    event.reply("SIGN_IN", true);
  } catch (error) {
    event.reply("SIGN_IN", false);
  }
  auth.currentUser.getIdToken().then(async function (idToken) {
    await session.defaultSession.cookies
      .set({
        url: "https://localhost:3000/*",
        name: "token",
        value: idToken,
        httpOnly: true, // client에서 쿠키 접근함을 방지하기위해 설정 ( 보안 설정 )
        // expirationDate: 10,
      })
      .then(() => {});
    await session.defaultSession.cookies
      .set({
        url: "https://localhost:3000/*",
        name: "uid",
        value: auth.currentUser.uid,
      })
      .then(() => {
        event.reply("TOKEN", true);
      });
  });
});

ipcMain.on("PROFILE", async (event, payload) => {
  await session.defaultSession.cookies
    .get({
      url: "https://localhost:3000/*",
      name: "uid",
    })
    .then(async (cookies) => {
      if (cookies.length > 0) {
        const q = query(
          collection(dbService, "users"),
          where("uid", "==", cookies[0]?.value)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          if (doc.exists()) {
            await event.reply("PROFILE_UID", doc.data());
          }
        });
      } else {
        await event.reply("PROFILE_UID", "");
      }
    });
});

ipcMain.on("CONNECTION", async (event, payload) => {
  // const isLogin = cookies.verify(payload.token.accessToken).ok;
  await session.defaultSession.cookies
    .get({
      url: "https://localhost:3000/*",
      name: "token",
    })
    .then(async (cookies) => {
      if (cookies.length > 0) {
        await session.defaultSession.cookies
          .get({
            url: "https://localhost:3000/*",
            name: "uid",
          })
          .then(async (cookies) => {
            await event.reply("CONNECTION", cookies[0]?.value);
          });
      } else {
        await event.reply("CONNECTION", "");
      }
    });
});

ipcMain.on("REMOVE_TOKEN", async (event, payload) => {
  await session.defaultSession
    .clearStorageData({ storages: ["cookies"] })
    .then(() => {
      event.reply("REMOVE_TOKEN", true);
    })
    .catch((error) => {
      event.reply("REMOVE_TOKEN", false);
    });
});

ipcMain.on("USER_LIST", async (event, payload) => {
  await session.defaultSession.cookies
    .get({
      url: "https://localhost:3000/*",
      name: "uid",
    })
    .then((cookies) => {
      const uid = cookies[0]?.value;
      const q = query(collection(dbService, "users"), where("uid", "!=", uid));
      onSnapshot(q, (querySnapshot) => {
        let userData = [];
        querySnapshot.forEach((doc) => {
          const userObj = {
            ...doc.data(),
            id: doc.id,
          };
          userData.push(userObj);
        });
        event.reply("USER_LIST", userData);
      });
    });
});

ipcMain.on("GETMESSAGES", (event, roomId) => {
  const q = query(
    collection(dbService, `messages${roomId}`),
    orderBy("createdAt", "desc"),
    limit(100)
  );
  let messageList = [];
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const mObj = {
        ...doc.data(),
        id: doc.id,
      };
      messageList.push(mObj);
    });
    event.reply("GETMESSAGES", messageList);
  });
});

ipcMain.on("SEND_MESSAGE", async (event, payload, roomId) => {
  try {
    await addDoc(collection(dbService, `messages${roomId}`), payload);
  } catch (error) {
    console.log("error", error);
  }
});

ipcMain.on("PING", (event, payload) => {
  event.reply("PONG", "pong");
});
//
app.on("window-all-closed", () => {
  app.quit();
});
