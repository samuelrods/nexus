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

const ActivityForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    formData,
    updating = false,
}) => {
    function toSqlDateFormat(date) {
        if (!date) return null;
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var day = date.getDate().toString().padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    const activityDate = data.date ? new Date(data.date) : null;

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 flex flex-col items-center max-w-lg mx-auto"
        >
            <div className="w-full grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Contact</Label>
                    <ComboBox
                        onChange={(data) => setData("contact_id", data.value)}
                        apiUrlPath={"/api/contacts-options"}
                        placeholder={"Search contacts..."}
                    />
                    <InputError message={errors.contact_id} />
                </div>
                <div className="space-y-1">
                    <Label>Lead (Optional)</Label>
                    <ComboBox
                        onChange={(data) => setData("lead_id", data.value)}
                        apiUrlPath={"/api/leads-options"}
                        placeholder={"Search leads..."}
                    />
                    <InputError message={errors.lead_id} />
                </div>
            </div>

            <div className="w-full space-y-1">
                <Label>Activity Type</Label>
                <Select
                    onChange={(data) => setData("type", data.value)}
                    options={[
                        { value: "call", label: "Call" },
                        { value: "email", label: "Email" },
                        { value: "meeting", label: "Meeting" },
                        { value: "other", label: "Other" },
                    ]}
                    placeholder="Select Type"
                    defaultValue={
                        data.type
                            ? {
                                  value: data.type,
                                  label: capitalizeFirstLetter(data.type),
                              }
                            : null
                    }
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (base) => ({
                            ...base,
                            borderRadius: '0.5rem',
                            borderColor: 'rgb(229 231 235)',
                            padding: '2px',
                        })
                    }}
                    menuPortalTarget={document.body}
                />
                <InputError message={errors.type} />
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal bg-white dark:bg-gray-800",
                                    !activityDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {activityDate ? format(activityDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={activityDate}
                                onSelect={(date) => setData("date", toSqlDateFormat(date))}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.date} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        placeholder="Time"
                        value={data.time ?? ""}
                        type="time"
                        onChange={(e) => setData("time", e.target.value)}
                        required
                        step={300} // 5 minutes
                        className="bg-white dark:bg-gray-800"
                    />
                    <InputError message={errors.time} />
                </div>
            </div>

            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    onChange={(e) => setData("description", e.target.value)}
                    id="description"
                    placeholder="Notes about the activity..."
                    required
                    rows={4}
                    className="bg-white dark:bg-gray-800"
                    value={data.description}
                />
                <InputError message={errors.description} />
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing
                        ? "Saving..."
                        : updating
                          ? "Update Activity"
                          : "Add Activity"}
                </Button>
            </div>
        </form>
    );
};

const Activities = ({ pagination }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"activities.index"}
                resourceType={"Activities"}
                storeRoute={"activities.store"}
                ResourceForm={ActivityForm}
                resourceInfo={[
                    ["contact_id", null],
                    ["lead_id", null],
                    ["type", null],
                    ["date", null],
                    ["time", null],
                    ["description", ""],
                ]}
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
                EditResourceForm={ActivityForm}
                resourceInfoKeys={[
                    "contact_id",
                    "lead_id",
                    "type",
                    "date",
                    "time",
                    "description",
                ]}
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
