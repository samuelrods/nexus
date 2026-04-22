import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";
import Table from "@/Shared/Table";
import { DollarSign, Handshake, Clock, TrendingUp } from "lucide-react";

const Deals = ({ pagination, stats }) => {
    return (
        <div className="space-y-6">
            <StatsGrid>
                <StatsCard 
                    title="Total Deals" 
                    value={stats.total_deals} 
                    icon={Handshake} 
                    color="blue"
                    description="Total deals for organization"
                />
                <StatsCard 
                    title="Total Value" 
                    value={`$${stats.total_value.toLocaleString()}`} 
                    icon={DollarSign} 
                    color="green"
                    trend="up"
                    trendValue={12}
                    description="Cumulative deal value"
                />
                <StatsCard 
                    title="Won Deals" 
                    value={stats.won_deals} 
                    icon={TrendingUp} 
                    color="purple"
                    description="Successfully closed deals"
                />
                <StatsCard 
                    title="Pending" 
                    value={stats.pending_deals} 
                    icon={Clock} 
                    color="yellow"
                    description="Deals awaiting closure"
                />
            </StatsGrid>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
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
