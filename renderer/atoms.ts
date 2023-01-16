import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

interface IData {
  user: string;
  textData: [];
}

export const roomIdAtom = atom({
  key: "roomId",
  default: "",
});
