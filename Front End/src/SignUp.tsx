import React from "react";
import Lottie from "lottie-react";
import SignInAnimation from "./assets/SignUp.json";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

export default function SignUp() {
  const occupations = [
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
          />
          <TextField
            required
            id="outlined-email"
            label="Email"
            type="email"
            variant="outlined"
          />
          <TextField
            required
            id="outlined-password"
            label="Password"
            type="password"
            variant="outlined"
          />
          <TextField
            id="outlined-select-occupation"
            select
            label="Select Occupation"
            helperText="Please select your occupation"
            variant="outlined"
          >
            {occupations.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
}
