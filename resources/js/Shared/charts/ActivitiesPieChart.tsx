import React from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
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

const ActivitiesPieChart = ({ data }) => {
    const chartData = [
        { type: "call", value: data.call ?? 0, fill: chartConfig.call.color },
        {
            type: "email",
            value: data.email ?? 0,
            fill: chartConfig.email.color,
        },
        {
            type: "meeting",
            value: data.meeting ?? 0,
            fill: chartConfig.meeting.color,
        },
        {
            type: "other",
            value: data.other ?? 0,
            fill: chartConfig.other.color,
        },
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
                        nameKey="type"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="type" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:justify-center"
                    />
                </PieChart>
            </ChartContainer>
        </div>
    );
};

export default ActivitiesPieChart;
