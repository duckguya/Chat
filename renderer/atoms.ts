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
  effects_UNSTABLE: [persistAtom],
});

export const clickedIdAtom = atom({
  key: "clickId",
  default: "",
});

export const textAtom = atom<IData[]>({
  key: "inputData",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
