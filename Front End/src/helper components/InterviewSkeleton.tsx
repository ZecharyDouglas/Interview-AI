import React from "react";
import axios from "axios";

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

  /*Right now each page is getting an placeholder confidence score from 

  */
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
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-4xl font-light ml-12 mt-10">Some Topic</h1>
        <div className="grid grid-cols-2 gap-4 p-10">
          <div className="bg-slate-100 shadow-md rounded-md p-6 flex flex-col items-center justify-center h-auto">
            <h2 className="font-thin font-Inter text-2xl mb-4">
              Confidence Trend
            </h2>
            <LineChart
              width={730}
              height={250}
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
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
          <div className="bg-slate-100 shadow-md rounded-md p-6 flex flex-col items-center justify-center h-auto">
            <h2 className="font-thin font-Inter text-2xl mb-4">
              Average Confidence Score
            </h2>
            <div className="bg-slate-200 shadow-md rounded-md p-6 items-center justify-center">
              <h1 className="font-bold text-4xl text-yellow-400">3.2</h1>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 shadow-md rounded-md p-6 flex flex-col items-center justify-center mt-5 h-auto">
          <h2 className="font-Inter font-thin">Select a Problem</h2>
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              className="rounded-md bg-slate-50 text-blue-300 m-2 p-2"
            >
              Name of Some Problem {index}
            </button>
          ))}
        </div>
        <div className="bg-slate-100 shadow-md rounded-md m-4 p-6 flex flex-col h-auto">
          <h2 className="text-3xl font-Inter font-extralight mb-4">Problem</h2>
          <div className="flex justify-center items-center">
            <button className="bg-blue-300 p-2 rounded-md hover:bg-blue-200">
              Begin
            </button>
          </div>
        </div>
        <div className="bg-slate-100 shadow-md rounded-md m-4 p-6 flex flex-col h-auto">
          <h2 className="text-3xl font-Inter font-extralight mb-4">
            Workspace
          </h2>
          {/* Workspace content goes here */}
        </div>
      </div>
    </div>
  );
}
