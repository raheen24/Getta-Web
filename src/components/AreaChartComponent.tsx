import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Container, Row, Col } from "react-bootstrap";

interface AreaChartProps {
  data: { date: string; revenue: number }[];
}

const AreaChartComponent: React.FC<AreaChartProps> = ({ data }) => {
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 100000) {
      return `$${(tickItem / 1000).toFixed(0)}K`;
    }
    return `$${tickItem}`;
  };

  return (
    <Card className="border-0">
      <Card.Body>
        <Container fluid className="px-0">
          <Row>
            <Col xs={12} className="px-0">
              <div style={{ height: "180px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00FF85"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00FF85"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, "dataMax"]}
                      tickCount={6}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#00FF85"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      dot={{ r: 4, fill: "#00FF85", strokeWidth: 2 }}
                      activeDot={{
                        r: 6,
                        fill: "#fff",
                        stroke: "#00FF85",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default AreaChartComponent;
