import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { Grid, Item } from "@mui/material"; // Make sure 'Item' is imported correctly or styled accordingly
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default function Insights() {
  const [confidenceValues, setConfidenceValues] = useState([
    {
      topic: "Arrays and Strings",
      confidence: 4,
    },
    {
      topic: "Hashing",
      confidence: 4,
    },
    {
      topic: "Linked Lists",
      confidence: 4,
    },
    {
      topic: "Stacks and Queues",
      confidence: 4,
    },
    {
      topic: "Trees and Graphs",
      confidence: 4,
    },
    {
      topic: "Heaps",
      confidence: 4,
    },
    {
      topic: "Gready Algorithms",
      confidence: 4,
    },
    {
      topic: "Binary Search",
      confidence: 4,
    },
    {
      topic: "Backtracking",
      confidence: 4,
    },
    {
      topic: "Dynamic Programming",
      confidence: 4,
    },
  ]);

  (async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/getconfidenceall",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  })();

  return (
    <div className="flex flex-col items-center ml-10 mr-10 mt-10">
      <div className=" flex-col align-top mt-0">
        <div className=" mb-10">
          <h1 className="  font-Inter text-3xl font-thin">
            Insights Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-2 ">
          {confidenceValues.map((value, index) => (
            <div className=" bg-slate-50 shadow-md rounded-md m-4 p-10 border-2 border-black flex items-center justify-center">
              <RadialBarChart
                width={100}
                height={100}
                innerRadius="60%"
                outerRadius="100%"
                data={[{ value: value.confidence, name: value.topic }]}
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
          ))}
        </div>
        <div className=" mt-10">
          <h1 className=" text-2xl font-thin">Top 5 Tips</h1>
          <ul>
            {[...Array(5)].map((_, index) => (
              <li className="mt-5 font-Inter font-thin" key={index}>
                {" "}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero
                alias vero qui. Facere sint, veniam eius recusandae,
                consequuntur sed dolore, asperiores illum dolorem a iusto
                blanditiis. Id eos animi amet?
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
