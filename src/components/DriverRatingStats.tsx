// components/DriverEarningsChart.tsx
import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  earnings: number;
  date: string; // formatted string like '21 Apr, 19:59'
}

const dummyGraphData = [
  { name: "1", value: 100 },
  { name: "2", value: 120 },
  { name: "3", value: 150 },
  { name: "4", value: 180 },
  { name: "5", value: 170 },
  { name: "6", value: 200 },
  { name: "7", value: 190 },
];

const DriverRatingStats: React.FC<Props> = ({ earnings, date }) => {
  return (
    <div
      className="earnings-chart-wrapper"
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        position: "relative",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="centered-value"
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#2c3e50",
            fontSize: "20px",
            marginBottom: "4px",
            fontWeight: "600",
          }}
        >
          ${earnings.toFixed(2)}
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "#999999",
            margin: 0,
          }}
        >
          {date}
        </p>
      </div>

      <div style={{ marginTop: "40px", height: "100px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dummyGraphData}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#02222f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#02222f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#73BE67"
              fillOpacity={1}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DriverRatingStats;
