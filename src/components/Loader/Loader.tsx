import style from "./Loader.module.css";
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <ClipLoader color="#36d7b7" size={50} />
      <p>Loading photos, please wait...</p>
    </div>
  );
}
