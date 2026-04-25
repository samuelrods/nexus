// @ts-nocheck
import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { COMMON_CURRENCIES } from "@/lib/currency";
import {
    Loader2,
    Save,
    Users,
    Handshake,
    AlertTriangle,
    Trash2,
} from "lucide-react";
import InputError from "@/Components/InputError";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";

const Settings = ({ organization }: any) => {
    const { auth } = usePage().props;
    const isOwner = auth.user?.id === organization.user_id;

    const { data, setData, put, processing, errors } = useForm({
        name: organization.name || "",
        currency: organization.currency || "USD",
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        put(route("organizations.update", { organization: organization.slug }));
    };

    const handleDelete = () => {
        if (
            confirm(
                "CRITICAL: Are you sure you want to delete this organization? All data including deals, contacts, and members will be PERMANENTLY deleted. This action cannot be undone.",
            )
        ) {
            router.delete(
                route("organizations.destroy", {
                    organization: organization.slug,
                }),
                {
                    onSuccess: () => router.visit(route("organizations.index")),
                },
            );
        }
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <Head title="Organization Settings" />

            <StatsGrid>
                <StatsCard
                    title="Total Members"
                    value={organization.members_count || 0}
                    icon={Users}
                    color="blue"
                    description="People in your workspace"
                />
                <StatsCard
                    title="Total Deals"
                    value={organization.deals_count || 0}
                    icon={Handshake}
                    color="green"
                    description="Active and closed deals"
                />
            </StatsGrid>

            <Card className="shadow-sm border-border overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>
                        Manage your organization's general information and
                        global settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Organization Name
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e: any) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Enter organization name"
                                    required
                                    className="h-10"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="currency"
                                    className="text-sm font-medium"
                                >
                                    Global Currency
                                </Label>
                                <Select
                                    value={data.currency}
                                    onValueChange={(value: any) =>
                                        setData("currency", value)
                                    }
                                >
                                    <SelectTrigger
                                        id="currency"
                                        className="h-10"
                                    >
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMMON_CURRENCIES.map((c: any) => (
                                            <SelectItem
                                                key={c.code}
                                                value={c.code}
                                            >
                                                {c.code} - {c.name} ({c.symbol})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    All financial values like deal amounts will
                                    be displayed using this currency.
                                </p>
                                <InputError message={errors.currency} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border/50">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 px-6"
                            >
                                {processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {isOwner && (
                <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
                    <CardHeader className="border-b border-destructive/10">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            <CardTitle className="text-lg">
                                Danger Zone
                            </CardTitle>
                        </div>
                        <CardDescription className="text-destructive/70">
                            Irreversible actions for your organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-semibold text-foreground">
                                    Delete this organization
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Once you delete an organization, there is no
                                    going back. Please be certain.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Organization
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

Settings.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Organization Settings" />
    </Layout>
);

export default Settings;
