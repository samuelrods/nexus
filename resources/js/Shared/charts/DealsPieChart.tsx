// @ts-nocheck
import React from "react";
import { Pie, PieChart, LabelList, Cell } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
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

const DealsPieChart = ({ data }: any) => {
    const chartData = [
        {
            status: "pending",
            value: data.pending ?? 0,
            fill: chartConfig.pending.color,
        },
        { status: "won", value: data.won ?? 0, fill: chartConfig.won.color },
        { status: "lost", value: data.lost ?? 0, fill: chartConfig.lost.color },
    ];

    return (
        <div className="w-full">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[400px]"
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
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        {chartData.map((entry: any, index: any) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="status" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:justify-center"
                    />
                </PieChart>
            </ChartContainer>
        </div>
    );
};

export default DealsPieChart;
