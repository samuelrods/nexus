import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";
import Table from "@/Shared/Table";
import { Users, UserPlus, Briefcase, Mail } from "lucide-react";

const Contacts = ({ pagination, stats, filters }) => {
    return (
        <div className="space-y-6">
            <StatsGrid>
                <StatsCard 
                    title="Total Contacts" 
                    value={stats.total_contacts} 
                    icon={Users} 
                    color="blue"
                    description="Total people in your network"
                />
                <StatsCard 
                    title="New This Month" 
                    value={stats.new_this_month} 
                    icon={UserPlus} 
                    color="green"
                    trend="up"
                    trendValue={12}
                    description="Recent additions"
                />
                <StatsCard 
                    title="Key Accounts" 
                    value={stats.key_accounts} 
                    icon={Briefcase} 
                    color="purple"
                    description="Contacts with associated deals"
                />
                <StatsCard 
                    title="Avg. Engagement" 
                    value="84%" 
                    icon={Mail} 
                    color="yellow"
                    description="Email interaction rate"
                />
            </StatsGrid>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <TableActions
                    searchRoute={"contacts.index"}
                    resourceType={"Contacts"}
                    createRoute={"contacts.create"}
                    filters={filters}
                />
                <Table
                    data={pagination.data}
                    columns={[
                        { header: "Name", key: "full_name", sortKey: "full_name" },
                        { header: "Email", key: "email", sortKey: "email" },
                        { header: "Phone Number", key: "phone_number" },
                        { header: "Organization", key: "organization_name", sortKey: "organization_name" },
                        { header: "Job Title", key: "job_title", sortKey: "job_title" },
                    ]}
                    resourceName={"contacts"}
                    filters={filters}
                />
                <TablePagination pagination={pagination.links} />
            </div>
        </div>
    );
};


Contacts.layout = (page) => (
    <Layout>
        <ResourceLayout children={page} title="Contacts" />
    </Layout>
);

export default Contacts;
