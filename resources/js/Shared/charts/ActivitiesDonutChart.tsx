// @ts-nocheck
import React from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

const chartConfig = {
    call: {
        label: "Call",
        color: "#E02424",
    },
    email: {
        label: "Email",
        color: "#057A55",
    },
    meeting: {
        label: "Meeting",
        color: "#1C64F2",
    },
    other: {
        label: "Other",
        color: "#7E3AF2",
    },
};

const ActivitiesDonutChart = ({ data }: any) => {
    const chartData = [
        {
            name: "Meeting",
            value: data.meeting ?? 0,
            fill: chartConfig.meeting.color,
        },
        {
            name: "Email",
            value: data.email ?? 0,
            fill: chartConfig.email.color,
        },
        { name: "Call", value: data.call ?? 0, fill: chartConfig.call.color },
        {
            name: "Other",
            value: data.other ?? 0,
            fill: chartConfig.other.color,
        },
    ];

    const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex flex-row items-center justify-between w-full h-full">
            <div className="flex-1 max-w-[200px]">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={55}
                            outerRadius={75}
                            strokeWidth={0}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalValue}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-[10px] uppercase font-medium"
                                                >
                                                    Activities
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>

            <div className="flex-1 space-y-3 px-4">
                {chartData.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                                {item.name}
                            </span>
                        </div>
                        <span className="text-xs font-bold text-foreground">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivitiesDonutChart;
