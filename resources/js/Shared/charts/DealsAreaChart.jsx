import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const chartConfig = {
    value: {
        label: "Deals",
        color: "hsl(var(--primary))",
    },
};

const DealsChart = ({ data, range }) => {
    const handleRangeData = (newRange) => {
        router.get(route('dashboard'), {
            "deals-range": newRange,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['dealAreaChartData', 'dealAreaChartRange']
        });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-1">
                        ${(data.total / 1000).toFixed(1)}k
                    </h5>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Deals total
                    </p>
                </div>
                <div
                    className={cn(
                        "flex items-center px-2.5 py-1 text-sm font-bold text-center rounded-full",
                        data.percentage > 0 ? "text-green-600 bg-green-50 dark:bg-green-900/20" : 
                        data.percentage < 0 ? "text-red-600 bg-red-50 dark:bg-red-900/20" : 
                        "text-gray-500 bg-gray-50"
                    )}
                >
                    {data.percentage.toFixed(1)}%
                    {data.percentage > 0 ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                    ) : data.percentage < 0 ? (
                        <TrendingDown className="ml-1 h-4 w-4" />
                    ) : null}
                </div>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart
                    data={data.dailyTotals}
                    margin={{
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        hide
                    />
                    <YAxis hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                        dataKey="value"
                        type="natural"
                        fill="var(--color-value)"
                        fillOpacity={0.4}
                        stroke="var(--color-value)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
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

export default DealsChart;
