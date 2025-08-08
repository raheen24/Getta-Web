import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Offline Drivers", value: 30.45, color: "#FF0000" },
  { name: "Online Drivers", value: 79.31, color: "#73BE67" },
];

// Custom label to show percentage in the center of each slice
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={data[index].color}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
    >
      {`${data[index].name.split(" ")[0]} ${
        percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
      }`}
    </text>
  );
};

const PieChartComponent: React.FC<{ pieData: any[] }> = ({ pieData }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <PieChart width={250} height={250}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          labelLine={false}
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill={pieData[index].color}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
              >
                {`${pieData[index].name.split(" ")[0]} ${
                  percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                }`}
              </text>
            );
          }}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
