import style from "./Loader.module.css";
import { BounceLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <BounceLoader color="#36d7b7" size={90} />
      <p>Loading photos, please wait...</p>
    </div>
  );
}
