import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import Table from "@/Shared/Table";
import ComboBox from "@/Shared/ComboBox";
import { Loader2 } from "lucide-react";
import Select from "react-select";

const Leads = ({ pagination }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <TableActions
                searchRoute={"leads.index"}
                resourceType={"Leads"}
                createRoute={"leads.create"}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Company", key: "company_name" },
                    { header: "Contact", key: "contact_fullname" },
                    { header: "Description", key: "description" },
                    { header: "Source", key: "source" },
                    { header: "Status", key: "status" },
                ]}
                resourceName={"leads"}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};


Leads.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Leads" />
    </Layout>
);

export default Leads;
