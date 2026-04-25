// @ts-nocheck
import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import InputError from "@/Components/InputError";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import Table from "@/Shared/Table";
import Select from "react-select";
import ComboBox from "@/Shared/ComboBox";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Activities = ({ pagination, filters }: any) => {
    const typeOptions = [
        { label: "Call", value: "call" },
        { label: "Meeting", value: "meeting" },
        { label: "Email", value: "email" },
        { label: "Other", value: "other" },
    ];

    return (
        <div className="bg-card p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"activities.index"}
                resourceType={"Activities"}
                createRoute={"activities.create"}
                filters={filters}
                filterOptions={[
                    {
                        label: "Type",
                        name: "type",
                        allLabel: "All Types",
                        options: typeOptions,
                    },
                ]}
            />
            <Table
                data={pagination.data}
                columns={[
                    {
                        header: "Contact",
                        key: "contact_fullname",
                        sortKey: "contact_fullname",
                    },
                    { header: "Type", key: "type", sortKey: "type" },
                    { header: "Date", key: "date", sortKey: "date" },
                    { header: "Time", key: "time" },
                    { header: "Description", key: "description" },
                ]}
                resourceName={"activities"}
                filters={filters}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};

Activities.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Activities" />
    </Layout>
);

export default Activities;
