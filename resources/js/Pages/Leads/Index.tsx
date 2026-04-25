// @ts-nocheck
import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
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

const Leads = ({ pagination, filters }: any) => {
    const statusOptions = [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "Converted", value: "converted" },
    ];

    const sourceOptions = [
        { label: "Website", value: "website" },
        { label: "Referral", value: "referral" },
        { label: "Social Media", value: "social_media" },
        { label: "Other", value: "other" },
    ];

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <TableActions
                searchRoute={"leads.index"}
                resourceType={"Leads"}
                createRoute={"leads.create"}
                filters={filters}
                filterOptions={[
                    {
                        label: "Status",
                        name: "status",
                        allLabel: "All Statuses",
                        options: statusOptions,
                    },
                    {
                        label: "Source",
                        name: "source",
                        allLabel: "All Sources",
                        options: sourceOptions,
                    },
                ]}
            />
            <Table
                data={pagination.data}
                columns={[
                    {
                        header: "Company",
                        key: "company_name",
                        sortKey: "company_name",
                    },
                    {
                        header: "Contact",
                        key: "contact_fullname",
                        sortKey: "contact_fullname",
                    },
                    { header: "Description", key: "description" },
                    { header: "Source", key: "source", sortKey: "source" },
                    { header: "Status", key: "status", sortKey: "status" },
                ]}
                resourceName={"leads"}
                filters={filters}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};

Leads.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Leads" />
    </Layout>
);

export default Leads;
