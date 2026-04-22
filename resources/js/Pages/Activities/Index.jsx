import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
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

const Activities = ({ pagination }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"activities.index"}
                resourceType={"Activities"}
                createRoute={"activities.create"}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Contact", key: "contact_fullname" },
                    { header: "Type", key: "type" },
                    { header: "Date", key: "date" },
                    { header: "Time", key: "time" },
                    { header: "Description", key: "description" },
                ]}
                resourceName={"activities"}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};

Activities.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Activities" />
    </Layout>
);

export default Activities;
