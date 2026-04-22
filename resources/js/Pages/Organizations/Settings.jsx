import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
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
import { Loader2, Save } from "lucide-react";
import InputError from "@/Components/InputError";

const Settings = ({ organization }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name || "",
        currency: organization.currency || "USD",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("organizations.update", organization.id));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <Head title="Organization Settings" />
            
            <Card className="shadow-sm border-border">
                <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>
                        Manage your organization's general information and global settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Organization Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Enter organization name"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Global Currency</Label>
                                <Select
                                    value={data.currency}
                                    onValueChange={(value) => setData("currency", value)}
                                >
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMMON_CURRENCIES.map((c) => (
                                            <SelectItem key={c.code} value={c.code}>
                                                {c.code} - {c.name} ({c.symbol})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                    All financial values like deal amounts will be displayed using this currency.
                                </p>
                                <InputError message={errors.currency} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700"
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
        </div>
    );
};

Settings.layout = (page) => (
    <Layout>
        <ResourceLayout children={page} title="Organization Settings" />
    </Layout>
);

export default Settings;
