import React from "react";
import Owl from "./assets/Owl.png";
import { Outlet, useNavigate, Link } from "react-router-dom";
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
            <Link
              to={`interview/arrays-and-strings`}
              className="font-thin font-inter text-lg "
            >
              Arrays and Strings
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/hashing`}
              className="font-thin font-inter text-lg "
            >
              Hashing
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/linked-lists`}
              className="font-thin font-inter text-lg "
            >
              Linked Lists
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/stacks-and-queues`}
              className="font-thin font-inter text-lg "
            >
              Stacks and Queues
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/trees-and-graphs`}
              className="font-thin font-inter text-lg "
            >
              Trees and Graphs
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/heaps`}
              className="font-thin font-inter text-lg "
            >
              Heaps
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/greedy-algorithms`}
              className="font-thin font-inter text-lg "
            >
              Greedy Algorithms
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`/interview/binary-search`}
              className="font-thin font-inter text-lg "
            >
              Binary Search
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/backtracking`}
              className="font-thin font-inter text-lg "
            >
              Backtracking
            </Link>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <Link
              to={`interview/dynamic-programming`}
              className="font-thin font-inter text-lg "
            >
              Dynamic Programming
            </Link>
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
              <Link
                to={`insights`}
                className="text-xl font-inter font-thin m-5"
              >
                Insights
              </Link>
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
