import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import RelationshipSelector from "@/Shared/RelationshipSelector";
import CompanyForm from "@/Pages/Companies/Form";
import ContactForm from "@/Pages/Contacts/Form";
import { Loader2 } from "lucide-react";
import Select from "react-select";

const LeadForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    updating = false,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 flex flex-col items-center max-w-lg mx-auto"
        >
            <div className="w-full space-y-1">
                <Label>Company</Label>
                <RelationshipSelector
                    value={data.company_id}
                    label={data.company_name}
                    onChange={(val, lab) => {
                        setData((prev) => ({
                            ...prev,
                            company_id: val,
                            company_name: lab,
                        }));
                    }}
                    resourceName="companies"
                    apiUrlPath="/api/companies-options"
                    ResourceForm={CompanyForm}
                    resourceInfo={[
                        ["name", ""],
                        ["website", ""],
                        ["industry", ""],
                        ["description", ""],
                        ["street_address", ""],
                        ["city", ""],
                        ["state", ""],
                        ["zip_code", ""],
                    ]}
                    placeholder="Search or add company..."
                />
                <InputError message={errors.company_id} />
            </div>
            <div className="w-full space-y-1">
                <Label>Contact</Label>
                <RelationshipSelector
                    value={data.contact_id}
                    label={data.contact_fullname}
                    onChange={(val, lab) => {
                        setData((prev) => ({
                            ...prev,
                            contact_id: val,
                            contact_fullname: lab,
                        }));
                    }}
                    resourceName="contacts"
                    apiUrlPath="/api/contacts-options"
                    ResourceForm={ContactForm}
                    resourceInfo={[
                        ["first_name", ""],
                        ["last_name", ""],
                        ["email", ""],
                        ["phone", ""],
                        ["position", ""],
                        ["description", ""],
                    ]}
                    placeholder="Search or add contact..."
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
                    value={
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
                    value={
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
                    value={data.description || ""}
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

export default LeadForm;
