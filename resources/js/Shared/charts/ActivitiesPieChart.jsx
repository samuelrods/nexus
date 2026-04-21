import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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

const ActivitiesPieChart = ({ data, range }) => {
    const chartData = [
        { type: "call", value: data.call ?? 0, fill: chartConfig.call.color },
        { type: "email", value: data.email ?? 0, fill: chartConfig.email.color },
        { type: "meeting", value: data.meeting ?? 0, fill: chartConfig.meeting.color },
        { type: "other", value: data.other ?? 0, fill: chartConfig.other.color },
    ];

    const handleRangeData = (newRange) => {
        router.get(route('dashboard'), {
            "activities-pie-chart-range": newRange,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['activityPieChartData', 'activityPieChartRange']
        });
    };

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Activity Type Distribution</h3>
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

            <div className="flex justify-between items-center pt-4 mt-6 border-t border-gray-100 dark:border-gray-700">
                <Select
                    defaultValue={range.toString()}
                    onValueChange={(value) => handleRangeData(parseInt(value))}
                >
                    <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ActivitiesPieChart;
