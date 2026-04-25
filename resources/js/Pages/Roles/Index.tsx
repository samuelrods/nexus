// @ts-nocheck
import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import Table from "@/Shared/Table";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Shield, ShieldAlert, Key } from "lucide-react";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";
import { Badge } from "@/Components/ui/badge";

const Roles = ({ pagination, permissions }: any) => {
    const totalRoles = pagination.meta?.total || pagination.data?.length || 0;
    const totalPermissions = Object.values(permissions).reduce(
        (acc: any, curr: any) => {
            const count = Array.isArray(curr)
                ? curr.length
                : Object.keys(curr).length;
            return acc + count;
        },
        0,
    );

    return (
        <div className="space-y-6">
            <StatsGrid>
                <StatsCard
                    title="Total Roles"
                    value={totalRoles}
                    icon={Shield}
                    color="blue"
                    description="Defined access levels"
                />
                <StatsCard
                    title="Total Permissions"
                    value={totalPermissions}
                    icon={Key}
                    color="purple"
                    description="Available system actions"
                />
            </StatsGrid>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            User Roles
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage roles and their associated permissions.
                        </p>
                    </div>
                </div>

                <TableActions
                    searchRoute={"roles.index"}
                    resourceType={"Roles"}
                    createRoute={"roles.create"}
                />
                <Table
                    data={pagination.data}
                    columns={[
                        {
                            header: "Name",
                            key: "name",
                            render: (value: any) => {
                                const isOwner = value.toLowerCase() === "owner";
                                return (
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize px-3 py-1 ${
                                                isOwner
                                                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                                    : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                            }`}
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {value}
                                        </Badge>
                                        {isOwner && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-none"
                                            >
                                                System
                                            </Badge>
                                        )}
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Members",
                            key: "users_count",
                            render: (value: any) => (
                                <span className="font-medium text-foreground">
                                    {value} {value === 1 ? "member" : "members"}
                                </span>
                            ),
                        },
                        { header: "Created At", key: "created_at" },
                    ]}
                    resourceName={"roles"}
                />
                <div className="mt-6">
                    <TablePagination
                        pagination={pagination.links || pagination}
                    />
                </div>
            </div>
        </div>
    );
};

Roles.layout = (page: any) => (
    <Layout title="Roles">
        <ResourceLayout children={page} title="Roles" />
    </Layout>
);

export default Roles;
