import React from "react";
import Owl from "./assets/Owl.png";
import { Outlet, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";

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
            <NavLink
              to={`interview/arrays-and-strings`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Arrays and Strings
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/hashing`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Hashing
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/linked-lists`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Linked Lists
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/stacks-and-queues`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Stacks and Queues
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/trees-and-graphs`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Trees and Graphs
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/heaps`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Heaps
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/greedy-algorithms`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Greedy Algorithms
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`/interview/binary-search`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Binary Search
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/backtracking`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Backtracking
            </NavLink>
          </div>
          <div className=" border-b-1 shadow-sm h-20 flex items-center justify-center">
            <NavLink
              to={`interview/dynamic-programming`}
              className={({ isActive }) =>
                `font-thin font-inter text-lg ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              Dynamic Programming
            </NavLink>
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
