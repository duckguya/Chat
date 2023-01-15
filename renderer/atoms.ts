import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

interface IData {
  user: string;
  textData: [];
}

export const userAtom = atom({
  key: "user",
  default: false,
});

export const roomIdAtom = atom({
  key: "roomIdAtom",
  default: "",
});
