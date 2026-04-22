import { router, Link } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import AddResourceModal from "@/Shared/AddResourceModal";
import singularize from "@/Shared/utils/singularize";

const TableActions = ({
    searchRoute,
    createRoute,
    resourceType,
    storeRoute,
    ResourceForm,
    resourceInfo,
    formData,
}) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            router.get(
                route(searchRoute, { query: searchValue }),
                {},
                { preserveState: true }
            );
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
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
                    onKeyDown={handleSearch}
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
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
    );
};

export default TableActions;
