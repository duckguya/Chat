import { Content } from "antd/lib/layout/layout";
import { useRecoilState } from "recoil";
import { userEmailAtom } from "../atoms";

function Chat() {
  const [email, setEmail] = useRecoilState(userEmailAtom);

  return <Content>{email}</Content>;
}

export default Chat;
