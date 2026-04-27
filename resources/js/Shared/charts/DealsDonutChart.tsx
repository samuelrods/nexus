// @ts-nocheck
import React from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

const chartConfig = {
    pending: {
        label: "Pending",
        color: "#FACA15",
    },
    won: {
        label: "Won",
        color: "#1C64F2",
    },
    lost: {
        label: "Lost",
        color: "#7E3AF2",
    },
};

const DealsDonutChart = ({ data }: any) => {
    const chartData = [
        { status: "won", value: data.won ?? 0, fill: chartConfig.won.color },
        {
            status: "pending",
            value: data.pending ?? 0,
            fill: chartConfig.pending.color,
        },
        { status: "lost", value: data.lost ?? 0, fill: chartConfig.lost.color },
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
                            nameKey="status"
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
                                                    className="fill-muted-foreground text-xs uppercase"
                                                >
                                                    Deals
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

            <div className="flex-1 space-y-4 px-4">
                {chartData.map((item) => (
                    <div
                        key={item.status}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-sm font-medium text-muted-foreground capitalize">
                                {item.status}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsDonutChart;
