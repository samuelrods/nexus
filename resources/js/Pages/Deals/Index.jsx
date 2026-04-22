import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";
import Table from "@/Shared/Table";
import { DollarSign, Handshake, Clock, TrendingUp } from "lucide-react";

const Deals = ({ pagination }) => {
    // Derived stats for demonstration
    const totalDeals = pagination.data.length;
    const totalValue = pagination.data.reduce((acc, deal) => acc + (parseFloat(deal.value) || 0), 0);
    const wonDeals = pagination.data.filter(d => d.status === 'won').length;
    const pendingDeals = pagination.data.filter(d => d.status === 'pending').length;

    return (
        <div className="space-y-6">
            <StatsGrid>
                <StatsCard 
                    title="Total Deals" 
                    value={totalDeals} 
                    icon={Handshake} 
                    color="blue"
                    description="Total deals in current view"
                />
                <StatsCard 
                    title="Total Value" 
                    value={`$${totalValue.toLocaleString()}`} 
                    icon={DollarSign} 
                    color="green"
                    trend="up"
                    trendValue={12}
                    description="Cumulative deal value"
                />
                <StatsCard 
                    title="Won Deals" 
                    value={wonDeals} 
                    icon={TrendingUp} 
                    color="purple"
                    description="Successfully closed deals"
                />
                <StatsCard 
                    title="Pending" 
                    value={pendingDeals} 
                    icon={Clock} 
                    color="yellow"
                    description="Deals awaiting closure"
                />
            </StatsGrid>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <TableActions
                    searchRoute={"deals.index"}
                    resourceType={"Deals"}
                    createRoute={"deals.create"}
                />
                <Table
                    data={pagination.data}
                    columns={[
                        { header: "Name", key: "name" },
                        { header: "Value", key: "value" },
                        { header: "Currency", key: "currency" },
                        { header: "Close date", key: "close_date" },
                        { header: "Status", key: "status" },
                        { header: "Company", key: "company_name" },
                        { header: "Contact", key: "contact_fullname" },
                    ]}
                    resourceName={"deals"}
                />
                <TablePagination pagination={pagination.links} />
            </div>
        </div>
    );
};

Deals.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Deals" />
    </Layout>
);

export default Deals;
