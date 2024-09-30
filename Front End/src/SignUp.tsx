import React from "react";
import Lottie from "lottie-react";
import SignInAnimation from "./assets/SignUp.json";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
  const occupations = [
    {
      value: "select",
      label: "Select",
    },
    {
      value: "student",
      label: "Student",
    },
    {
      value: "instructor",
      label: "Instructor",
    },
    {
      value: "industry_professional",
      label: "Industry Professional",
    },
  ];
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleOccupation = (event) => {
    setOccupation(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const signUpUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/signup", {
        name: name,
        email: email,
        password: password,
        occupation: occupation,
      });
      console.log(response.data);
      if (response.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center ">
      {/* Animation container */}
      <div className="absolute top-0 w-4/5 h-4/5 z-0">
        <Lottie animationData={SignInAnimation} />
      </div>

      {/* Form container */}
      <div className="relative z-10 bg-opacity-80 mt-50 p-8 rounded-lg shadow-md max-w-md w-full">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-col space-y-4"
        >
          <TextField
            required
            id="outlined-name"
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleName}
          />
          <TextField
            required
            id="outlined-email"
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={handleEmail}
          />
          <TextField
            required
            id="outlined-password"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePassword}
          />

          <TextField
            id="outlined-select-occupation"
            select
            label="Select Occupation"
            helperText="Please select your occupation"
            variant="outlined"
            value={occupation}
            onChange={handleOccupation}
          >
            {occupations.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={signUpUser}>
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
}
