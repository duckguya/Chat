import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

interface IData {
  user: string;
  textData: [];
}
interface IUser {
  uid: string;
  email: string;
  createdAt: number;
}
export const loginUserInfoAtom = atom<IUser>({
  key: "loginUser",
  default: {
    uid: "",
    email: "",
    createdAt: 0,
  },
});

export const roomTypeAtom = atom({
  key: "roomType",
  default: "",
});

export const roomIdAtom = atom({
  key: "roomId",
  default: "",
});

export const isLoginAtom = atom({
  key: "isLogin",
  default: false,
});
