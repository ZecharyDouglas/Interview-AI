import { Button } from "@headlessui/react";
import { Field, Fieldset, Input, Label, Legend } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { SignInPage } from "@toolpad/core/SignInPage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const signInUser = async (provider, formData) => {
    if (provider.id == "credentials") {
      try {
        const response = await axios
          .post("http://127.0.0.1:5000/signin", formData)
          .then((response) => {
            console.log(response.data);
            console.log(response.status);
            if (response.status == 200) {
              setTimeout(() => {
                navigate("/insights");
              }, 3000);
            }
          });
      } catch (error) {
        console.log(error.response.data);
      }
    }
    //else to be handled later
    // else{

    // }
  };
  return <SignInPage signIn={signInUser} providers={providers} />;
}