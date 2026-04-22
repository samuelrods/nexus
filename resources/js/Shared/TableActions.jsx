import { router, Link } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AddResourceModal from "@/Shared/AddResourceModal";
import singularize from "@/Shared/utils/singularize";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import debounce from "lodash/debounce";

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
}) => {
    const [searchValue, setSearchValue] = useState(filters.query || "");

    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(
                route(searchRoute),
                { ...filters, query: query || undefined, page: undefined },
                { preserveState: true }
            );
        }, 300),
        [filters, searchRoute]
    );

    useEffect(() => {
        if (searchValue !== (filters.query || "")) {
            debouncedSearch(searchValue);
        }
    }, [searchValue]);

    const handleFilterChange = (name, value) => {
        router.get(
            route(searchRoute),
            { ...filters, [name]: value === "all" ? undefined : value, page: undefined },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        router.get(route(searchRoute), {}, { preserveState: true });
        setSearchValue("");
    };

    const hasActiveFilters = Object.keys(filters).some(
        (key) => filters[key] && key !== "sort_by" && key !== "sort_dir" && key !== "page"
    );

    return (
        <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                        type="text"
                        placeholder={"Search " + resourceType.toLowerCase() + "..."}
                        className="pl-10 bg-card border-border focus:ring-blue-500 focus:border-blue-500 block w-full text-foreground"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground hover:text-foreground"
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
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href={route(createRoute)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add {singularize(resourceType)}
                            </Link>
                        </Button>
                    ) : null}
                </div>
            </div>

            {filterOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter) => (
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
                                    {filter.options.map((option) => (
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
