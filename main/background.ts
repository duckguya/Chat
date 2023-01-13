import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { Server } from "socket.io";
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
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

ipcMain.on("SIGN_UP", (event, payload) => {});

ipcMain.on("SIGN_IN", (event, payload) => {});

// ipcMain.on("FIRST_CONNECTION", (event, payload) => {
//   const isLogin = jwtToken.verify(payload.token.accessToken).ok;

//   event.reply("FIRST_CONNECTION", { isLogin });
// });

ipcMain.on("REQ_USER_LIST", async (event, payload) => {});
app.on("window-all-closed", () => {
  app.quit();
});
