import Layout from "@/Shared/Layout";
import ActivitiesPieChart from "@/Shared/charts/ActivitiesPieChart";
import DealsAreaChart from "@/Shared/charts/DealsAreaChart";
import DealsPieChart from "@/Shared/charts/DealsPieChart";
import { Head, router, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";

const Dashboard = ({
    dealAreaChartData,
    dealAreaChartRange,
    dealPieChartData,
    dealPieChartRange,
    activityPieChartData,
    activityPieChartRange,
}) => {
    const { auth } = usePage().props;

    const handleOrganizationSelection = (organizationId) => {
        router.put(route("users.organization"), {
            organization_id: organizationId,
        });
    };

    return (
        <div className="space-y-8">
            <Head title="Dashboard" />
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-3xl font-bold h-auto p-0 hover:bg-transparent flex items-center gap-2">
                            {auth.organization.name}
                            <ChevronDown className="h-8 w-8 text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                        {auth.user.memberships.map((membership) => (
                            <DropdownMenuItem
                                onClick={() => handleOrganizationSelection(membership.organization.id)}
                                key={"dashboard-" + membership.organization.id}
                                className="text-lg py-3 cursor-pointer"
                            >
                                {membership.organization.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                    <DealsAreaChart
                        data={dealAreaChartData}
                        range={dealAreaChartRange}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                        <DealsPieChart
                            data={dealPieChartData}
                            range={dealPieChartRange}
                        />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border">
                        <ActivitiesPieChart
                            data={activityPieChartData}
                            range={activityPieChartRange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

Dashboard.layout = (page) => <Layout children={page} title="Dashboard" />;

export default Dashboard;
