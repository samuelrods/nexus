import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import RelationshipSelector from "@/Shared/RelationshipSelector";
import CompanyForm from "@/Pages/Companies/Form";
import ContactForm from "@/Pages/Contacts/Form";
import { Loader2 } from "lucide-react";

const LeadForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    updating = false,
}) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 w-full max-w-2xl"
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
                    apiUrlPath={route("companies.options", { organization: organizationSlug })}
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
                    apiUrlPath={route("contacts.options", { organization: organizationSlug })}
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
                    onValueChange={(val) => setData("source", val)}
                    value={data.source || ""}
                >
                    <SelectTrigger data-testid="lead-source-trigger">
                        <SelectValue placeholder="Select Source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="social_media">Social Media</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.source} />
            </div>
            <div className="w-full space-y-1">
                <Label>Status</Label>
                <Select
                    onValueChange={(val) => setData("status", val)}
                    value={data.status || ""}
                >
                    <SelectTrigger data-testid="lead-status-trigger">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                </Select>
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
                    value={data.description || ""}
                    data-testid="lead-description"
                />
                <InputError message={errors.description} />
            </div>
            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                    data-testid="lead-submit"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? "Saving..." : updating ? "Update Lead" : "Add Lead"}
                </Button>
            </div>
        </form>
    );
};

export default LeadForm;
