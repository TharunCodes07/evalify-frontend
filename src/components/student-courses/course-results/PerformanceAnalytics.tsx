"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface PieChartData {
  category: string;
  count: number;
  fill: string;
}

interface BarChartData {
  reviewName: string;
  score: number;
}

interface PerformanceAnalyticsProps {
  pieChartData: PieChartData[];
  pieChartConfig: ChartConfig;
  barChartData: BarChartData[];
  barChartConfig: ChartConfig;
}

const pieChartConfig = {
  count: {
    label: "Reviews",
  },
  excellent: {
    label: "Excellent (≥85%)",
    color: "#10B981",
  },
  good: {
    label: "Good (70-84%)",
    color: "#F59E0B",
  },
  average: {
    label: "Average (50-69%)",
    color: "#F97316",
  },
  poor: {
    label: "Poor (<50%)",
    color: "#EF4444",
  },
} satisfies ChartConfig;

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  pieChartData,
  barChartData,
  barChartConfig,
}) => {
  // Process pie chart data to match the shadcn pattern
  const processedPieData = pieChartData.map((item) => {
    const category = item.category.toLowerCase();
    let fillKey = "poor";

    if (category.includes("excellent") || category.includes("≥85")) {
      fillKey = "excellent";
    } else if (category.includes("good") || category.includes("70-84")) {
      fillKey = "good";
    } else if (category.includes("average") || category.includes("50-69")) {
      fillKey = "average";
    } else if (category.includes("poor") || category.includes("<50")) {
      fillKey = "poor";
    }

    return {
      category: item.category,
      count: item.count,
      fill: `var(--color-${fillKey})`,
    };
  });

  const totalCount = pieChartData.reduce((sum, item) => sum + item.count, 0);

  // Function to get fill key based on score or category
  const getFillKey = (value: number | string) => {
    if (typeof value === "number") {
      if (value >= 85) return "excellent";
      if (value >= 70) return "good";
      if (value >= 50) return "average";
      return "poor";
    }
    const category = value.toLowerCase();
    if (category.includes("excellent") || category.includes("≥85"))
      return "excellent";
    if (category.includes("good") || category.includes("70-84")) return "good";
    if (category.includes("average") || category.includes("50-69"))
      return "average";
    return "poor";
  };

  // Function to get category based on score
  const getScoreCategory = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Poor";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Pie Chart - No Card Wrapper */}
      <div className="flex flex-col">
        <div className="items-center pb-0 mb-4">
          <h3 className="text-lg font-semibold text-center text-foreground">
            Score Distribution
          </h3>
        </div>
        <div className="flex-1 pb-0">
          <ChartContainer
            config={pieChartConfig}
            className="mx-auto aspect-square max-h-[250px] px-0"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="count"
                    hideLabel
                    formatter={(value, name, props) => [
                      `${value} reviews (${(
                        (Number(value) / totalCount) *
                        100
                      ).toFixed(1)}%)`,
                      props.payload.category,
                    ]}
                  />
                }
              />
              <Pie
                data={processedPieData}
                dataKey="count"
                labelLine={false}
                label={({ payload, ...props }) => {
                  const percentage = (
                    (payload.count / totalCount) *
                    100
                  ).toFixed(1);
                  const fillKey = getFillKey(payload.category);
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill={`var(--color-${fillKey})`}
                      fontSize={12}
                      fontWeight="500"
                    >
                      {`${payload.category} ${percentage}%`}
                    </text>
                  );
                }}
                nameKey="category"
              />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg">Review Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={barChartConfig}
            className="min-h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="reviewName"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={{
                    stroke: "hsl(var(--foreground))",
                    strokeWidth: 1,
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  tickFormatter={(value) =>
                    value.slice(0, 10) + (value.length > 10 ? "..." : "")
                  }
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={true}
                  axisLine={{
                    stroke: "hsl(var(--foreground))",
                    strokeWidth: 1,
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <ChartTooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.1)" }}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, props) => {
                        const score = value as number;
                        const category = getScoreCategory(score);
                        const fillKey = getFillKey(score);
                        return [
                          <span
                            key="score"
                            style={{ color: `var(--color-${fillKey})` }}
                          >
                            {`${score}% (${category})`}
                          </span>,
                          props.payload.reviewName,
                        ];
                      }}
                    />
                  }
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => {
                    const fillKey = getFillKey(entry.score);
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={`var(--color-${fillKey})`}
                      />
                    );
                  })}
                  <LabelList
                    dataKey="score"
                    position="top"
                    formatter={(value: number) => `${value}%`}
                    style={{
                      fill: "hsl(var(--foreground))",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
