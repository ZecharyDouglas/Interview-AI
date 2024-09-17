import { useRouteError } from "react-router-dom";
import ErrorImage from "./assets/Error.svg";

export default function RouteError() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className=" flex-col font-sans">
      <h1 className=" text-center py-5">
        <b>Error 404</b>
      </h1>
      <h2 className=" py-5">
        There was an error when we tried to fetch your page
      </h2>
      <h2 className=" py-5 text-center">
        Try reloading the page or{" "}
        <a href="/" className=" text-blue-600 hover:text-blue-500">
          go back home
        </a>
      </h2>
      <img src={ErrorImage} alt="" />
    </div>
  );
}
