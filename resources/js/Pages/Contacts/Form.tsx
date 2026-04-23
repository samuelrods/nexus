import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Loader2 } from "lucide-react";
import RelationshipSelector from "@/Shared/RelationshipSelector";
import CompanyForm from "@/Pages/Companies/Form";
import { usePage } from "@inertiajs/react";

const ContactForm = ({
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
            className="space-y-4 w-full max-w-2xl"
        >
            <div className="grid grid-cols-2 gap-4 w-full">
                <div className="space-y-1">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        placeholder="John"
                        value={data.first_name || ""}
                        onChange={(e) => setData("first_name", e.target.value)}
                        required
                        className="bg-card"
                        data-testid="contact-first-name"
                    />
                    <InputError message={errors.first_name} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        placeholder="Doe"
                        value={data.last_name || ""}
                        onChange={(e) => setData("last_name", e.target.value)}
                        required
                        className="bg-card"
                        data-testid="contact-last-name"
                    />
                    <InputError message={errors.last_name} />
                </div>
            </div>
            
            <div className="w-full space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={data.email || ""}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    className="bg-card"
                    data-testid="contact-email"
                />
                <InputError message={errors.email} />
            </div>
            
            <div className="w-full space-y-1">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                    id="phone_number"
                    placeholder="+1 (555) 000-0000"
                    value={data.phone_number || ""}
                    onChange={(e) => setData("phone_number", e.target.value)}
                    required
                    className="bg-card"
                    data-testid="contact-phone"
                />
                <InputError message={errors.phone_number} />
            </div>

            <div className="w-full space-y-1">
                <Label htmlFor="company_id">Company</Label>
                <RelationshipSelector
                    value={data.company_id}
                    label={data.organization_name}
                    onChange={(val, lab) => {
                        setData((prev) => ({
                            ...prev,
                            company_id: val,
                            organization_name: lab,
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
                    placeholder="Search or create company..."
                />
                <InputError message={errors.organization_name} />
            </div>

            <div className="w-full space-y-1">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                    id="job_title"
                    placeholder="e.g. Software Engineer"
                    value={data.job_title || ""}
                    onChange={(e) => setData("job_title", e.target.value)}
                    required
                    className="bg-card"
                    data-testid="contact-job-title"
                />
                <InputError message={errors.job_title} />
            </div>

            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Background info, notes, etc."
                    value={data.description || ""}
                    onChange={(e) => setData("description", e.target.value)}
                    required
                    rows={4}
                    className="bg-card"
                    data-testid="contact-description"
                />
                <InputError message={errors.description} />
            </div>
            
            <div className="pt-6">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                    data-testid="contact-submit"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing
                        ? "Saving..."
                        : updating
                          ? "Update Contact"
                          : "Add Contact"}
                </Button>
            </div>
        </form>
    );
};

export default ContactForm;
