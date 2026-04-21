import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import Table from "@/Shared/Table";
import { Loader2 } from "lucide-react";

const ContactForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    formData,
    updating = false
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 flex flex-col items-center max-w-lg mx-auto"
        >
            <div className="w-full grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        placeholder="First Name"
                        value={data.first_name}
                        onChange={(e) => setData("first_name", capitalizeFirstLetter(e.target.value))}
                        required
                        autoComplete="off"
                        className="bg-white dark:bg-gray-800"
                    />
                    <InputError message={errors.first_name} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        placeholder="Last Name"
                        value={data.last_name}
                        onChange={(e) => setData("last_name", capitalizeFirstLetter(e.target.value))}
                        required
                        autoComplete="off"
                        className="bg-white dark:bg-gray-800"
                    />
                    <InputError message={errors.last_name} />
                </div>
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-white dark:bg-gray-800"
                />
                <InputError message={errors.email} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                    id="job_title"
                    placeholder="e.g. Software Engineer"
                    value={data.job_title}
                    onChange={(e) => setData("job_title", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-white dark:bg-gray-800"
                />
                <InputError message={errors.job_title} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="organization_name">Organization Name</Label>
                <Input
                    id="organization_name"
                    placeholder="Current Company/Org"
                    value={data.organization_name}
                    onChange={(e) =>
                        setData("organization_name", e.target.value)
                    }
                    required
                    autoComplete="off"
                    className="bg-white dark:bg-gray-800"
                />
                <InputError message={errors.organization_name} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                    id="phone_number"
                    placeholder="Phone Number"
                    value={data.phone_number}
                    onChange={(e) => setData("phone_number", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-white dark:bg-gray-800"
                />
                <InputError message={errors.phone_number} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Background info, notes, etc."
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    required
                    rows={4}
                    className="bg-white dark:bg-gray-800"
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
                    {processing ? "Saving..." : updating ? "Update Contact" : "Add Contact"}
                </Button>
            </div>
        </form>
    );
};

const Contacts = ({ pagination }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <TableActions
                searchRoute={"contacts.index"}
                resourceType={"Contacts"}
                storeRoute={"contacts.store"}
                ResourceForm={ContactForm}
                resourceInfo={[
                    ["first_name", ""],
                    ["last_name", ""],
                    ["email", ""],
                    ["phone_number", ""],
                    ["organization_name", ""],
                    ["job_title", ""],
                    ["description", ""],
                ]}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Name", key: "full_name" },
                    { header: "Email", key: "email" },
                    { header: "Phone Number", key: "phone_number" },
                    { header: "Organization", key: "organization_name" },
                    { header: "Job Title", key: "job_title" },
                ]}
                resourceName={"contacts"}
                EditResourceForm={ContactForm}
                resourceInfoKeys={[
                    "first_name",
                    "last_name",
                    "email",
                    "phone_number",
                    "organization_name",
                    "job_title",
                    "description",
                ]}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};


Contacts.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Contacts" />
    </Layout>
);

export default Contacts;
