import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import Table from "@/Shared/Table";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Users, ShieldCheck } from "lucide-react";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";

const Index = ({ pagination, filters, rolesData }) => {
    const totalMembers = pagination.meta?.total || pagination.data?.length || 0;
    const adminCount = pagination.data?.filter(
        (m) => m.role_name === "Admin" || m.role_name === "Owner",
    ).length;

    return (
        <div className="space-y-6">
            <StatsGrid>
                <StatsCard
                    title="Total Members"
                    value={totalMembers}
                    icon={Users}
                    color="blue"
                    description="Total people in organization"
                />
                <StatsCard
                    title="Admins"
                    value={adminCount}
                    icon={ShieldCheck}
                    color="purple"
                    description="Users with elevated access"
                />
            </StatsGrid>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">
                        Organization Members
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your team members and their roles.
                    </p>
                </div>
                <TableActions
                    searchRoute={"members.index"}
                    resourceType={"Members"}
                    createRoute={"members.create"}
                    filters={filters}
                />
                <Table
                    data={pagination.data}
                    columns={[
                        {
                            header: "Member",
                            key: "full_name",
                            sortKey: "first_name",
                        },
                        { header: "Email", key: "email", sortKey: "email" },
                        { header: "Role", key: "role_name" },
                    ]}
                    resourceName={"members"}
                    filters={filters}
                />
                <div className="mt-6">
                    <TablePagination pagination={pagination.links} />
                </div>
            </div>
        </div>
    );
};

Index.layout = (page) => (
    <Layout>
        <ResourceLayout children={page} title="Members" />
    </Layout>
);

export default Index;
