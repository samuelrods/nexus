// @ts-nocheck
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
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
import ContactForm from "@/Pages/Contacts/Form";
import LeadForm from "@/Pages/Leads/Form";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ActivityForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    updating = false,
}: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    function toSqlDateFormat(date: any) {
        if (!date) return null;
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var day = date.getDate().toString().padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    const activityDate = data.date ? new Date(data.date) : null;

    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-2xl">
            <div className="w-full grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Contact</Label>
                    <RelationshipSelector
                        value={data.contact_id}
                        label={data.contact_fullname}
                        onChange={(val: any, lab: any) => {
                            setData((prev: any) => ({
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
                <div className="space-y-1">
                    <Label>Lead (Optional)</Label>
                    <RelationshipSelector
                        value={data.lead_id}
                        label={data.lead_description}
                        onChange={(val: any, lab: any) => {
                            setData((prev: any) => ({
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
                        placeholder="Lead..."
                    />
                    <InputError message={errors.lead_id} />
                </div>
            </div>

            <div className="w-full space-y-1">
                <Label>Activity Type</Label>
                <Select
                    onValueChange={(val: any) => setData("type", val)}
                    value={data.type || ""}
                >
                    <SelectTrigger data-testid="activity-type-trigger">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
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
                                    "w-full justify-start text-left font-normal bg-card",
                                    !activityDate && "text-muted-foreground",
                                )}
                                data-testid="activity-date-trigger"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {activityDate ? (
                                    format(activityDate, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={activityDate}
                                onSelect={(date: any) =>
                                    setData("date", toSqlDateFormat(date))
                                }
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
                        value={data.time || ""}
                        type="time"
                        onChange={(e: any) => {
                            const value = e.target.value;
                            setData(
                                "time",
                                value.length === 5 ? `${value}:00` : value,
                            );
                        }}
                        required
                        step={300} // 5 minutes
                        data-testid="activity-time"
                    />
                    <InputError message={errors.time} />
                </div>
            </div>

            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    onChange={(e: any) => setData("description", e.target.value)}
                    id="description"
                    placeholder="Notes about the activity..."
                    required
                    rows={4}
                    value={data.description || ""}
                    data-testid="activity-description"
                />
                <InputError message={errors.description} />
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                    data-testid="activity-submit"
                >
                    {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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

export default ActivityForm;
