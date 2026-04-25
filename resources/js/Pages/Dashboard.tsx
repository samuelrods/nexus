import React from "react";
import Layout from "@/Shared/Layout";
import ActivitiesPieChart from "@/Shared/charts/ActivitiesPieChart";
import DealsAreaChart from "@/Shared/charts/DealsAreaChart";
import DealsPieChart from "@/Shared/charts/DealsPieChart";
import { StatsCard } from "@/Shared/StatsGrid";
import { Head, router, usePage, Link } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import {
    ChevronDown,
    DollarSign,
    Target,
    Calendar,
    Users,
    UserPlus,
    Briefcase,
    ArrowUpRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface DashboardProps {
    dealAreaChartData: any;
    dealPieChartData: any;
    activityPieChartData: any;
    range: string | number;
    teamMemberCount: number;
    totalLeads: number;
    totalContacts: number;
    upcomingActivities: any[];
    recentLeads: any[];
    topDeals: any[];
}

const Dashboard = ({
    dealAreaChartData,
    dealPieChartData,
    activityPieChartData,
    range,
    teamMemberCount,
    totalLeads,
    totalContacts,
    upcomingActivities,
    recentLeads,
    topDeals,
}: DashboardProps) => {
    const { auth } = usePage().props;

    const handleRangeChange = (newRange: string) => {
        router.get(
            route("dashboard", { organization: auth.organization.slug }),
            {
                range: newRange,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="space-y-8 pb-10">
            <Head title="Dashboard" />

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {auth.organization.name}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {auth.user?.full_name?.split(" ")[0]}.
                        Here's what's happening today.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <Select
                        defaultValue={range.toString()}
                        onValueChange={handleRangeChange}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] h-10 bg-card border-border">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-sm bg-card border px-4 py-2 rounded-lg shadow-sm font-medium text-muted-foreground flex items-center justify-center">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatsCard
                    title="Revenue"
                    value={formatCurrency(
                        dealAreaChartData.total,
                        auth.organization?.currency,
                    )}
                    icon={DollarSign}
                    color="green"
                    trend={dealAreaChartData.percentage >= 0 ? "up" : "down"}
                    trendValue={Math.abs(
                        Math.round(dealAreaChartData.percentage),
                    )}
                />
                <StatsCard
                    title="Active Deals"
                    value={Object.values(dealPieChartData).reduce(
                        (a: any, b: any) => a + b,
                        0,
                    )}
                    icon={Target}
                    color="blue"
                />
                <StatsCard
                    title="Leads"
                    value={totalLeads}
                    icon={UserPlus}
                    color="purple"
                />
                <StatsCard
                    title="Contacts"
                    value={totalContacts}
                    icon={Users}
                    color="yellow"
                />
                <StatsCard
                    title="Activities"
                    value={Object.values(activityPieChartData).reduce(
                        (a: any, b: any) => a + b,
                        0,
                    )}
                    icon={Calendar}
                    color="red"
                />
                <StatsCard
                    title="Team"
                    value={teamMemberCount}
                    icon={Briefcase}
                    color="blue"
                />
            </div>

            {/* Main Trends Chart */}
            <Card className="shadow-sm bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        Revenue Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DealsAreaChart data={dealAreaChartData} />
                </CardContent>
            </Card>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-500" />
                            Deals by Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DealsPieChart data={dealPieChartData} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-500" />
                            Activity Types
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivitiesPieChart data={activityPieChartData} />
                    </CardContent>
                </Card>
            </div>

            {/* Operational Lists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Upcoming Activities */}
                <Card className="shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Upcoming Activities
                        </CardTitle>
                        <Link
                            href={route("activities.index", {
                                organization: auth.organization.slug,
                            })}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingActivities.length > 0 ? (
                                upcomingActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 mt-1 uppercase text-[10px] font-bold">
                                            {activity.type}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm line-clamp-1 text-foreground">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    activity.date,
                                                ).toLocaleDateString()}{" "}
                                                at {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No upcoming activities
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card className="shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Recent Leads
                        </CardTitle>
                        <Link
                            href={route("leads.index", {
                                organization: auth.organization.slug,
                            })}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold text-xs uppercase">
                                                {lead.contact?.first_name?.[0]}
                                                {lead.contact?.last_name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-foreground">
                                                    {lead.contact?.first_name}{" "}
                                                    {lead.contact?.last_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {lead.status}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route("leads.show", {
                                                organization:
                                                    auth.organization.slug,
                                                lead: lead.id,
                                            })}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <ChevronDown className="w-4 h-4 rotate-270" />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No recent leads
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Deals */}
                <Card className="shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-lg font-semibold">
                            Top Pending Deals
                        </CardTitle>
                        <Link
                            href={route("deals.index", {
                                organization: auth.organization.slug,
                            })}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topDeals.length > 0 ? (
                                topDeals.map((deal) => (
                                    <div
                                        key={deal.id}
                                        className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                                    >
                                        <div>
                                            <p className="font-medium text-sm line-clamp-1 text-foreground">
                                                {deal.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">
                                                {deal.status}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-green-600 dark:text-green-400">
                                                {formatCurrency(
                                                    deal.value,
                                                    auth.organization?.currency,
                                                )}
                                            </p>
                                            <Link
                                                href={route("deals.show", {
                                                    organization:
                                                        auth.organization.slug,
                                                    deal: deal.id,
                                                })}
                                                className="text-[10px] text-blue-500 hover:underline"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No pending deals
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

(Dashboard as any).layout = (page: React.ReactNode) => (
    <Layout children={page} />
);

export default Dashboard;
