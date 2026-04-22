import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import Table from "@/Shared/Table";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import InputError from "@/Components/InputError";
import { Loader2 } from "lucide-react";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";

const Roles = ({ pagination, permissions }) => {
    return (
        <div className="bg-card p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"roles.index"}
                resourceType={"Roles"}
                createRoute={"roles.create"}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Name", key: "name" },
                    { header: "Created At", key: "created_at" },
                    { header: "Updated At", key: "updated_at" },
                ]}
                resourceName={"roles"}
            />
            <TablePagination pagination={pagination.links || pagination} />
        </div>
    );
};

Roles.layout = (page) => (
    <Layout title="Roles">
        <ResouceLayout children={page} title="Roles" />
    </Layout>
);

export default Roles;
