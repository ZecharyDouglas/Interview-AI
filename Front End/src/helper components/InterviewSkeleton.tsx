import React from "react";
import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

export default function InterviewSkeleton() {
  return (
    <div className="flex flex-col">
      <div className=" grid grid-cols-10 grid-rows-10">
        <div className=" col-span-5">
          <h2>Your progress so far</h2>
          <div>
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
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
        <div className=" col-span-5">
          <h2>Your confidence score</h2>
          <div className=" bg-slate-50 shadow-md rounded-md m-4 p-10 border-2 border-black flex flex-col items-center justify-center  whitespace-nowrap">
            <h5 className="mb-5">Lorem Ipsum</h5>

            <RadialBarChart
              width={100}
              height={100}
              innerRadius="60%"
              outerRadius="100%"
              data={[{ value: 5, name: "Some Topic" }]}
              startAngle={180}
              endAngle={0}
              className=""
            >
              <RadialBar
                minAngle={15}
                label={{ fill: "#CCF", position: "insideCenter" }}
                background
                clockWise={true}
                dataKey="value"
                className=""
              />
              <Tooltip />
            </RadialBarChart>
          </div>
        </div>
      </div>
      <h2 className="text-center">Select a Problem</h2>
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <button key={index} className=" rounded-md bg-slate-50 text-blue-300">
            Name of Some Problem
          </button>
        ))}
      </div>
    </div>
  );
}
