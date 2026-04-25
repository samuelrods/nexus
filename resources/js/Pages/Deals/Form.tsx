import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { usePage } from "@inertiajs/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Calendar } from "@/Components/ui/calendar";
import InputError from "@/Components/InputError";
import RelationshipSelector from "@/Shared/RelationshipSelector";
import CompanyForm from "@/Pages/Companies/Form";
import ContactForm from "@/Pages/Contacts/Form";
import LeadForm from "@/Pages/Leads/Form";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DealForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    updating = false,
}) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    function toSqlDateFormat(date) {
        if (!date) return null;
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var day = date.getDate().toString().padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    const closeDate = data.close_date ? new Date(data.close_date) : null;

    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-2xl">
            <div className="w-full space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Enter deal name"
                    value={data.name || ""}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoComplete="off"
                    data-testid="deal-name"
                />
                <InputError message={errors.name} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="value">Value</Label>
                <Input
                    id="value"
                    placeholder="0.00"
                    type="number"
                    step={0.01}
                    value={data.value || ""}
                    onChange={(e) => setData("value", e.target.value)}
                    required
                    data-testid="deal-value"
                />
                <InputError message={errors.value} />
            </div>
            <div className="w-full space-y-1">
                <Label>Close Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal bg-card",
                                !closeDate && "text-muted-foreground",
                            )}
                            data-testid="deal-close-date-trigger"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {closeDate ? (
                                format(closeDate, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={closeDate}
                            onSelect={(date) =>
                                setData("close_date", toSqlDateFormat(date))
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <InputError message={errors.close_date} />
            </div>
            <div className="w-full space-y-1">
                <Label>Status</Label>
                <Select
                    onValueChange={(val) => setData("status", val)}
                    value={data.status || ""}
                >
                    <SelectTrigger data-testid="deal-status-trigger">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.status} />
            </div>

            <div className="w-full space-y-1">
                <Label>Lead</Label>
                <RelationshipSelector
                    value={data.lead_id}
                    label={data.lead_description}
                    onChange={(val, lab) => {
                        setData((prev) => ({
                            ...prev,
                            lead_id: val,
                            lead_description: lab,
                        }));
                    }}
                    resourceName="leads"
                    apiUrlPath={route("leads.options", {
                        organization: organizationSlug,
                    })}
                    ResourceForm={LeadForm}
                    resourceInfo={[
                        ["source", ""],
                        ["status", "open"],
                        ["description", ""],
                    ]}
                    placeholder="Search or add lead..."
                />
                <InputError message={errors.lead_id} />
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
                <div className="space-y-1">
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
                        apiUrlPath={route("companies.options", {
                            organization: organizationSlug,
                        })}
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
                        placeholder="Company..."
                    />
                    <InputError message={errors.company_id} />
                </div>
                <div className="space-y-1">
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
                        apiUrlPath={route("contacts.options", {
                            organization: organizationSlug,
                        })}
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
                        placeholder="Contact..."
                    />
                    <InputError message={errors.contact_id} />
                </div>
            </div>

            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    onChange={(e) => setData("description", e.target.value)}
                    id="description"
                    placeholder="Deal description..."
                    required
                    rows={3}
                    value={data.description || ""}
                    data-testid="deal-description"
                />
                <InputError message={errors.description} />
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                    data-testid="deal-submit"
                >
                    {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {processing
                        ? "Saving..."
                        : updating
                          ? "Update Deal"
                          : "Add Deal"}
                </Button>
            </div>
        </form>
    );
};

export default DealForm;
