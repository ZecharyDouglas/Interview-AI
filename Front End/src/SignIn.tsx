import { Button } from "@headlessui/react";
import { Field, Fieldset, Input, Label, Legend } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { SignInPage } from "@toolpad/core/SignInPage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SigninModal from "./helper components/SigninModal";

const providers = [
  {
    id: "google",
    name: "Google",
  },
  {
    id: "github",
    name: "Github",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
  },
  {
    id: "credentials",
    name: "Email and Password",
  },
];

export default function SignIn() {
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  const signInUser = async (provider, formData) => {
    if (provider.id == "credentials") {
      try {
        const response = await axios
          .post("/api/signin", formData, {
            withCredentials: true,
          })
          .then((response) => {
            console.log(response.data);
            if (response.status == 200) {
              setSignedIn(true);
              setTimeout(() => {
                navigate("/insights");
              }, 3000);
            }
          });
      } catch (error) {
        alert("Sign In Failed!");
        console.log(error.response.data);
      }
    }
    //else to be handled later
    // else{

    // }
  };

  return (
    <>
      {signedIn ? (
        <SigninModal />
      ) : (
        <SignInPage signIn={signInUser} providers={providers} />
      )}
    </>
  );
}
