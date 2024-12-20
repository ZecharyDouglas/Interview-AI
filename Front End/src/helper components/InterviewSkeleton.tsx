import React from "react";
import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
  Line,
  RadialBar,
  RadialBarChart,
} from "recharts";

export default function InterviewSkeleton() {
  const data = [
    {
      name: "",
      confidenceScore: 2.3,
      amt: 2400,
    },
    {
      name: "Page B",
      confidenceScore: 1.7,
      amt: 2210,
    },
    {
      name: "Page C",
      confidenceScore: 2.6,
      amt: 2290,
    },
    {
      name: "Page C",
      confidenceScore: 3.5,
      amt: 2290,
    },
    {
      name: "Page C",
      confidenceScore: 3.7,
      amt: 2290,
    },
  ];
  return (
    <div className=" flex flex-col">
      <div className="flex flex-col">
        <h1 className=" text-4xl font-light ml-12 mt-10">Some Topic</h1>
        <div className=" grid grid-cols-10 grid-rows-10 p-10 ">
          <div className=" col-span-5 bg-slate-100 shadow-md rounded-md m-4 p-10  flex flex-col items-center justify-center  whitespace-nowrap overflow-clip">
            <h2 className=" font-thin font-Inter text-2xl mb-4">
              Confidence Trend
            </h2>
            <div className="">
              <LineChart
                className=""
                width={730}
                height={250}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid className="" strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="confidenceScore"
                  stroke="#8884d8"
                />
              </LineChart>
            </div>
          </div>
          <div className=" col-span-5 bg-slate-100 shadow-md rounded-md m-4 p-10  flex flex-col items-center justify-center  whitespace-nowrap">
            <h2 className="font-thin font-Inter text-2xl mb-4">
              Average Confidence Score
            </h2>
            <div className=" bg-slate-200 shadow-md rounded-md m-4 p-10 items-center justify-center ">
              <h1 className=" font-bold text-4xl text-yellow-400">3.2</h1>
            </div>
          </div>
          <div className="col-span-10 bg-slate-100 shadow-md rounded-md m-4 p-7  flex flex-col items-center justify-center  p mt-5">
            <h2 className="font-Inter font-thin">Select a Problem</h2>
            {[...Array(5)].map((_, index) => (
              <button
                key={index}
                className=" rounded-md bg-slate-50 text-blue-300"
              >
                Name of Some Problem
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
