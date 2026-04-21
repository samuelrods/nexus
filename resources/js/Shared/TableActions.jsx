import { router } from "@inertiajs/react";
import AddResourceModal from "./AddResourceModal";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const TableActions = ({
    searchRoute,
    storeRoute,
    resourceType,
    resourceInfo,
    ResourceForm,
    formData = null,
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
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <Input
                    type="text"
                    placeholder={"Search " + resourceType.toLowerCase() + "..."}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 block w-full dark:text-white"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <AddResourceModal
                    resourceType={resourceType}
                    storeRoute={storeRoute}
                    resourceInfo={resourceInfo}
                    buttonTexts={["Add", resourceType]}
                    ResourceForm={ResourceForm}
                    formData={formData}
                />
            </div>
        </div>
    );
};

export default TableActions;
