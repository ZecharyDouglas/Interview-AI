import { useRouteError } from "react-router-dom";
import ErrorImage from "./assets/Error.json";
import Lottie from "lottie-react";

export default function RouteErrorSignIn() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className=" flex-col font-sans justify-center items-center">
      <h1 className=" text-center py-5">
        <b>Error 401</b>
      </h1>
      <h2 className=" py-5 text-center">
        There was an error when we tried to fetch your page due to lack of
        authentication. Please login to access our service.
      </h2>
      <h2 className=" py-5 text-center">
        Go to the{" "}
        <a href="/signin" className=" text-blue-600 hover:text-blue-500">
          sign in page
        </a>
        .
      </h2>
      <div className=" flex items-center justify-center">
        <Lottie animationData={ErrorImage} className=" h-1/5 w-1/5" />
      </div>
    </div>
  );
}
