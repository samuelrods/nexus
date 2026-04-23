import { router, Link, usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import AddResourceModal from "@/Shared/AddResourceModal";
import singularize from "@/Shared/utils/singularize";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

// Custom debounce function to remove lodash dependency
const debounce = (fn: Function, ms: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

const TableActions = ({
    searchRoute,
    createRoute,
    resourceType,
    storeRoute,
    ResourceForm,
    resourceInfo,
    formData,
    filters = {},
    filterOptions = [],
}: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const [searchValue, setSearchValue] = useState(filters.query || "");

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            router.get(
                route(searchRoute, { organization: organizationSlug }),
                { ...filters, query: query || undefined, page: undefined },
                { preserveState: true }
            );
        }, 300),
        [filters, searchRoute, organizationSlug]
    );

    useEffect(() => {
        if (searchValue !== (filters.query || "")) {
            debouncedSearch(searchValue);
        }
    }, [searchValue]);

    const handleFilterChange = (name: string, value: string) => {
        router.get(
            route(searchRoute, { organization: organizationSlug }),
            { ...filters, [name]: value === "all" ? undefined : value, page: undefined },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        router.get(route(searchRoute, { organization: organizationSlug }), {}, { preserveState: true });
        setSearchValue("");
    };

    const hasActiveFilters = Object.keys(filters).some(
        (key) => filters[key] && key !== "sort_by" && key !== "sort_dir" && key !== "page"
    );

    const createRouteUrl = useMemo(() => {
        if (!createRoute) return null;
        return route(createRoute, { organization: organizationSlug });
    }, [createRoute, organizationSlug]);

    return (
        <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                        type="text"
                        placeholder={"Search " + resourceType.toLowerCase() + "..."}
                        className="pl-10 bg-muted/50 border-border focus:ring-primary focus:border-primary block w-full text-foreground rounded-xl transition-all duration-200"
                        value={searchValue}
                        onChange={(e: any) => setSearchValue(e.target.value)}
                        data-testid="table-search"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                    )}
                    {ResourceForm ? (
                        <AddResourceModal
                            resourceType={singularize(resourceType)}
                            resourceInfo={resourceInfo}
                            storeRoute={storeRoute}
                            ResourceForm={ResourceForm}
                            formData={formData}
                        />
                    ) : createRoute ? (
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-xl px-5 transition-all active:scale-95" data-testid="create-resource-link">
                            <Link href={createRouteUrl || "#"}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add {singularize(resourceType)}
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            {filterOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter: any) => (
                        <div key={filter.name} className="w-full sm:w-40">
                            <Select
                                value={filters[filter.name] || "all"}
                                onValueChange={(value) => handleFilterChange(filter.name, value)}
                            >
                                <SelectTrigger className="w-full bg-card border-border">
                                    <SelectValue placeholder={`Filter by ${filter.label}`} />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="all">{filter.allLabel || `All ${filter.label}`}</SelectItem>
                                    {filter.options.map((option: any) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TableActions;
