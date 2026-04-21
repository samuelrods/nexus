import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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

const DealsPieChart = ({ data, range }) => {
    const chartData = [
        { status: "pending", value: data.pending ?? 0, fill: chartConfig.pending.color },
        { status: "won", value: data.won ?? 0, fill: chartConfig.won.color },
        { status: "lost", value: data.lost ?? 0, fill: chartConfig.lost.color },
    ];

    const handleRangeData = (newRange) => {
        router.get(route('dashboard'), {
            "deals-pie-chart-range": newRange,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['dealPieChartData', 'dealPieChartRange']
        });
    };

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Deal Type Distribution</h3>
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
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <ChartLegend
                        content={<ChartLegendContent nameKey="status" />}
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

export default DealsPieChart;
