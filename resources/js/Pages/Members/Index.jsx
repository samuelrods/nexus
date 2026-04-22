import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import Table from "@/Shared/Table";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";

const Index = ({ pagination }) => {
    return (
        <div className="bg-card p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"members.index"}
                resourceType={"Members"}
                createRoute={"members.create"}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Name", key: "full_name" },
                    { header: "Email", key: "email" },
                    { header: "Role", key: "role_name" },
                ]}
                resourceName={"members"}
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
