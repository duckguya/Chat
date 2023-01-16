import { app, ipcMain, session } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { Server } from "socket.io";
import Cookies from "universal-cookie";
import { async } from "@firebase/util";

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
    console.log("roomid", roomId);
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
    width: 1000,
    height: 750,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  }
})();

ipcMain.on("SIGN_UP", (event, payload) => {});

ipcMain.on("SIGN_IN", (event, { idToken, uid }) => {
  session.defaultSession.cookies
    .set({
      url: "http://localhost:3000/*",
      name: "token",
      value: idToken,
      httpOnly: true, // client에서 쿠키 접근함을 방지하기위해 설정 ( 보안 설정 )
      // expirationDate: 10,
    })
    .then(() => {});
  session.defaultSession.cookies
    .set({ url: "http://localhost:3000/*", name: "uid", value: uid })
    .then(() => {
      event.reply("TOKEN", true);
    });
});

ipcMain.on("PROFILE", (event, payload) => {
  session.defaultSession.cookies
    .get({
      url: "http://localhost:3000/*",
      name: "uid",
    })
    .then((cookies) => {
      console.log("cookies", cookies);
      if (cookies.length > 0) {
        console.log("cookies[0]?.value", cookies[0]?.value);
        event.reply("PROFILE", cookies[0]?.value);
      } else {
        event.reply("PROFILE", "");
      }
    });
});

ipcMain.on("CONNECTION", async (event, payload) => {
  // const isLogin = cookies.verify(payload.token.accessToken).ok;
  session.defaultSession.cookies
    .get({
      url: "http://localhost:3000/*",
      name: "token",
    })
    .then((cookies) => {
      if (cookies.length > 0) {
        event.reply("CONNECTION", true);
      } else {
        event.reply("CONNECTION", false);
      }
    });
  // console.log("payload.token", payload.token);
  // if (payload.token === token && token) {
  //   event.reply("LOGIN_CONNECTION", true);
  // } else {
  //   event.reply("LOGIN_CONNECTION", false);
  // }
});

ipcMain.on("REMOVE_TOKEN", async (event, payload) => {
  session.defaultSession
    .clearStorageData({ storages: ["cookies"] })
    .then(() => {
      event.reply("REMOVE_TOKEN", true);
    })
    .catch((error) => {
      event.reply("REMOVE_TOKEN", false);
    });
});

ipcMain.on("REQ_USER_LIST", async (event, payload) => {});
app.on("window-all-closed", () => {
  app.quit();
});
