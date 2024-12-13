import React from "react";
import Owl from "./assets/Owl.png";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Wrapper() {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await axios
        .post(
          "/api/logout",
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.data);
          if (response.status == 200) {
            console.log("Logged Out Successfully.");
            alert("You have been successfully logged out, redirecting....");
            setTimeout(() => {
              navigate("/signin");
            }, 2000);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="grid grid-cols-5 h-screen w-screen">
        <div className=" bg-slate-50 border-r-2 row-span-full flex-row ">
          <div className=" border-b-2 shadow-md h-20 flex items-center justify-center">
            <p className="font-thin font-inter text-xl ">Interview Topics</p>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Arrays and Strings
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Hashing
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Linked Lists
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Stacks and Queues
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Trees and Graphs
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Heaps
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Greedy Algorithms
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Binary Search
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Backtracking
            </a>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <a
              href="http://something.com"
              className="font-thin font-inter text-lg "
            >
              Dynamic Programming
            </a>
          </div>
        </div>
        <nav className=" col-span-4">
          <div className=" h-20 w bg-slate-50 flex mx-auto items-center justify-between border-b-2 shadow-md">
            <img src={Owl} className=" ml-5 h-10 w-10" />

            <div className="">
              <a
                href="http://something.com"
                className=" text-xl font-inter font-thin m-5"
              >
                Home
              </a>
              <a
                href="http://something.com"
                className="text-xl font-inter font-thin m-5"
              >
                Insights
              </a>
              <a
                href="http://something.com"
                className="text-xl font-inter font-thin m-5"
              >
                Profile
              </a>
              <button
                onClick={logoutUser}
                className="text-xl font-inter font-thin m-5 bg-red-500 rounded-md p-2 hover:bg-red-300"
              >
                Log Out
              </button>
            </div>
          </div>
          <Outlet />
        </nav>
      </div>
    </>
  );
}
