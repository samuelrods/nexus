import { router } from "@inertiajs/react";
import AddResourceModal from "./AddResourceModal";
import { Input } from "@/Components/ui/input";

const TableActions = ({
    searchRoute,
    storeRoute,
    resourceType,
    resourceInfo,
    ResourceForm,
    formData = null,
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-sm">
                <Input
                    placeholder={"Search for " + resourceType.toLowerCase() + "..."}
                    className="bg-white dark:bg-gray-800"
                    onKeyDown={(e) =>
                        e.key === "Enter" &&
                        router.get(
                            route(searchRoute, { query: e.target.value }),
                            {},
                            { preserveState: true },
                        )
                    }
                />
            </div>
            <AddResourceModal
                resourceType={resourceType}
                storeRoute={storeRoute}
                resourceInfo={resourceInfo}
                buttonTexts={["Add", resourceType]}
                ResourceForm={ResourceForm}
                formData={formData}
            />
        </div>
    );
};

export default TableActions;
