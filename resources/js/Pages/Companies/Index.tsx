// @ts-nocheck
import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { StatsGrid, StatsCard } from "@/Shared/StatsGrid";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import Table from "@/Shared/Table";
import { Loader2, Building2, Globe, Factory, MapPin } from "lucide-react";

const CompanyForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    formData,
    updating = false,
}: any) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-2xl">
            <div className="w-full space-y-1">
                <Label htmlFor="name">Company Name</Label>
                <Input
                    id="name"
                    placeholder="Enter company name"
                    value={data.name}
                    onChange={(e: any) => setData("name", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-card"
                />
                <InputError message={errors.name} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="industry">Industry</Label>
                <Input
                    id="industry"
                    placeholder="e.g. Technology, Finance"
                    value={data.industry}
                    onChange={(e: any) => setData("industry", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-card"
                />
                <InputError message={errors.industry} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="website">Website</Label>
                <Input
                    id="website"
                    placeholder="https://example.com"
                    value={data.website}
                    onChange={(e: any) => setData("website", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-card"
                />
                <InputError message={errors.website} />
            </div>
            <div className="w-full space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Company overview, notes, etc."
                    value={data.description}
                    onChange={(e: any) => setData("description", e.target.value)}
                    required
                    rows={4}
                    className="bg-card"
                />
                <InputError message={errors.description} />
            </div>

            <div className="w-full space-y-4 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 border-b pb-1">
                    Address Information
                </h3>
                <div className="space-y-1">
                    <Label htmlFor="street_address">Street Address</Label>
                    <Input
                        id="street_address"
                        placeholder="123 Main St"
                        value={data.street_address}
                        onChange={(e: any) =>
                            setData("street_address", e.target.value)
                        }
                        required
                        className="bg-card"
                    />
                    <InputError message={errors.street_address} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            placeholder="City"
                            value={data.city}
                            onChange={(e: any) => setData("city", e.target.value)}
                            required
                            className="bg-card"
                        />
                        <InputError message={errors.city} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor="state">State</Label>
                        <Input
                            id="state"
                            placeholder="State"
                            value={data.state}
                            onChange={(e: any) => setData("state", e.target.value)}
                            required
                            className="bg-card"
                        />
                        <InputError message={errors.state} />
                    </div>
                    <div className="col-span-1 space-y-1">
                        <Label htmlFor="zip_code">Zip Code</Label>
                        <Input
                            id="zip_code"
                            placeholder="Zip"
                            value={data.zip_code}
                            onChange={(e: any) =>
                                setData("zip_code", e.target.value)
                            }
                            required
                            className="bg-card"
                        />
                        <InputError message={errors.zip_code} />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                >
                    {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {processing
                        ? "Saving..."
                        : updating
                          ? "Update Company"
                          : "Add Company"}
                </Button>
            </div>
        </form>
    );
};

const Companies = ({ pagination, stats, filters, industries = [] }: any) => {
    return (
        <div className="space-y-6">
            <StatsGrid>
                <StatsCard
                    title="Total Companies"
                    value={stats.total_companies}
                    icon={Building2}
                    color="blue"
                    description="Registered organizations"
                />
                <StatsCard
                    title="Industries"
                    value={stats.industries}
                    icon={Factory}
                    color="purple"
                    description="Diverse market sectors"
                />
                <StatsCard
                    title="Active Sites"
                    value={stats.total_companies}
                    icon={Globe}
                    color="green"
                    trend="up"
                    trendValue={5}
                    description="Digital presence"
                />
                <StatsCard
                    title="HQ Locations"
                    value={stats.total_companies}
                    icon={MapPin}
                    color="yellow"
                    description="Global distribution"
                />
            </StatsGrid>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <TableActions
                    searchRoute={"companies.index"}
                    resourceType={"Companies"}
                    createRoute={"companies.create"}
                    filters={filters}
                    filterOptions={[
                        {
                            label: "Industry",
                            name: "industry",
                            allLabel: "All Industries",
                            options: industries.map((i: any) => ({
                                label: i,
                                value: i,
                            })),
                        },
                    ]}
                />
                <Table
                    data={pagination.data}
                    columns={[
                        { header: "Name", key: "name", sortKey: "name" },
                        {
                            header: "Website",
                            key: "website",
                            sortKey: "website",
                        },
                        {
                            header: "Industry",
                            key: "industry",
                            sortKey: "industry",
                        },
                        { header: "Address", key: "address_full" },
                    ]}
                    resourceName={"companies"}
                    filters={filters}
                />
                <TablePagination pagination={pagination.links} />
            </div>
        </div>
    );
};

Companies.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Companies" />
    </Layout>
);

export default Companies;
