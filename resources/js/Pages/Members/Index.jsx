import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import Table from "@/Shared/Table";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";

const Index = ({ pagination, filters }) => {
    return (
        <div className="bg-card p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"members.index"}
                resourceType={"Members"}
                createRoute={"members.create"}
                filters={filters}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Name", key: "full_name", sortKey: "first_name" },
                    { header: "Email", key: "email", sortKey: "email" },
                    { header: "Role", key: "role_name" },
                ]}
                resourceName={"members"}
                filters={filters}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};

Index.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Members" />
    </Layout>
);

export default Index;
