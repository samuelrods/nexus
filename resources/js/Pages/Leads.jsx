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

const LeadForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    formData,
    updating = false,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 flex flex-col items-center max-w-lg mx-auto"
        >
            <div className="w-full space-y-1">
                <Label>Company</Label>
                <ComboBox
                    onChange={(data) => setData("company_id", data.value)}
                    apiUrlPath={"/api/companies-options"}
                />
                <InputError message={errors.company_id} />
            </div>
            <div className="w-full space-y-1">
                <Label>Contact</Label>
                <ComboBox
                    onChange={(data) => setData("contact_id", data.value)}
                    apiUrlPath={"/api/contacts-options"}
                />
                <InputError message={errors.contact_id} />
            </div>
            <div className="w-full space-y-1">
                <Label>Source</Label>
                <Select
                    onChange={(data) => setData("source", data.value)}
                    options={[
                        { value: "website", label: "Website" },
                        { value: "referral", label: "Referral" },
                        { value: "social_media", label: "Social Media" },
                        { value: "other", label: "Other" },
                    ]}
                    placeholder="Select Source"
                    defaultValue={
                        data.source
                            ? {
                                  value: data.source,
                                  label: capitalizeFirstLetter(
                                      data.source ?? "",
                                  ),
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
                            '&:hover': {
                                borderColor: 'rgb(209 213 219)'
                            }
                        })
                    }}
                    menuPortalTarget={document.body}
                />
                <InputError message={errors.source} />
            </div>
            <div className="w-full space-y-1">
                <Label>Status</Label>
                <Select
                    onChange={(data) => setData("status", data.value)}
                    options={[
                        { value: "open", label: "Open" },
                        { value: "closed", label: "Closed" },
                        { value: "converted", label: "Converted" },
                    ]}
                    placeholder="Select Status"
                    defaultValue={
                        data.status
                            ? {
                                  value: data.status,
                                  label: capitalizeFirstLetter(
                                      data.status ?? "",
                                  ),
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
                            '&:hover': {
                                borderColor: 'rgb(209 213 219)'
                            }
                        })
                    }}
                    menuPortalTarget={document.body}
                />
                <InputError message={errors.status} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    onChange={(e) => setData("description", e.target.value)}
                    id="description"
                    placeholder="Provide some details about this lead..."
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
                    {processing ? "Saving..." : updating ? "Update Lead" : "Add Lead"}
                </Button>
            </div>
        </form>
    );
};

const Leads = ({ pagination }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"leads.index"}
                resourceType={"Leads"}
                storeRoute={"leads.store"}
                ResourceForm={LeadForm}
                resourceInfo={[
                    ["source", null],
                    ["status", null],
                    ["description", ""],
                    ["contact_id", null],
                    ["company_id", null],
                ]}
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
                EditResourceForm={LeadForm}
                resourceInfoKeys={[
                    "source",
                    "status",
                    "description",
                    "contact_id",
                    "company_id",
                ]}
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
