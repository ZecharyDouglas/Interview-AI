import { Button } from "@headlessui/react";
import { Field, Fieldset, Input, Label, Legend } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { SignInPage } from "@toolpad/core/SignInPage";

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
  return <SignInPage providers={providers} />;
}
