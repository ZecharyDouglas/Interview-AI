import React, { useState } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { Grid, Item } from "@mui/material"; // Make sure 'Item' is imported correctly or styled accordingly

export default function Insights() {
  const [confidenceValues, setConfidenceValues] = useState([
    4, 4, 5, 8, 8, 4, 4, 5, 8, 8,
  ]);

  return (
    <div>
      <h1>Insights</h1>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {confidenceValues.map((value, index) => (
          <Grid item xs={1} sm={1} md={2} key={index}>
            <RadialBarChart
              width={150}
              height={150}
              innerRadius="70%"
              outerRadius="100%"
              data={[{ value, name: `Value ${index}` }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                label={{ fill: "#666", position: "insideStart" }}
                background
                clockWise={true}
                dataKey="value"
              />
              <Tooltip />
            </RadialBarChart>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
