// @ts-nocheck
import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Search, Plus, Loader2, Check, X } from "lucide-react";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import { cn } from "@/lib/utils";
import singularize from "@/Shared/utils/singularize";

const RelationshipSelector = ({
    value,
    onChange,
    label,
    resourceName,
    apiUrlPath,
    ResourceForm,
    resourceInfo,
    placeholder = "Search...",
}: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("search");
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItemLabel, setSelectedItemLabel] = useState(label || "");

    // For "Add New" form
    const [formData, setFormData] = useState(
        Object.fromEntries(resourceInfo || []),
    );
    const [errors, setErrors] = useState({});
    const [creating, setCreating] = useState(false);

    const setData = (key: any, val: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: val }));
    };

    useEffect(() => {
        if (label) setSelectedItemLabel(label);
    }, [label]);

    const handleSearch = async (term: any) => {
        setSearchTerm(term);
        setLoading(true);
        try {
            const response = await axios.get(apiUrlPath, {
                params: { query: term },
            });
            const data = response.data;
            setOptions(data.data || data);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load initial options when opening search tab
    useEffect(() => {
        if (open && tab === "search") {
            handleSearch(searchTerm);
        }
    }, [open, tab]);

    const handleSelect = (item: any, e: any) => {
        if (e) e.stopPropagation();
        setSelectedItemLabel(item.label);
        onChange(item.value, item.label);
        setOpen(false);
    };

    const handleCreate = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCreating(true);
        setErrors({});
        try {
            // We use axios to get a JSON response
            const response = await axios.post(
                route(`${resourceName}.store`, {
                    organization: organizationSlug,
                }),
                formData,
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/json",
                    },
                },
            );

            // Laravel Resources wrap data in a 'data' key
            const newItem = response.data.data || response.data;
            const val = newItem.id;

            // Extract label based on available fields in the Resource
            const lab =
                newItem.name ||
                newItem.full_name ||
                newItem.contact_fullname ||
                newItem.company_name ||
                (newItem.first_name
                    ? `${newItem.first_name} ${newItem.last_name}`
                    : `ID: ${newItem.id}`);

            setSelectedItemLabel(lab);
            onChange(val, lab);
            setOpen(false);
            setTab("search"); // Reset tab
            // Reset formData
            setFormData(Object.fromEntries(resourceInfo || []));
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error creating resource:", error);
            }
        } finally {
            setCreating(false);
        }
    };

    const clearSelection = (e: any) => {
        e.stopPropagation();
        setSelectedItemLabel("");
        onChange(null, null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="relative w-full">
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-card border-border h-10"
                    >
                        <span className="truncate text-left pr-2">
                            {selectedItemLabel || placeholder}
                        </span>
                        <div className="flex items-center shrink-0">
                            {selectedItemLabel && (
                                <X
                                    className="mr-2 h-4 w-4 opacity-50 hover:opacity-100 shrink-0"
                                    onClick={clearSelection}
                                />
                            )}
                            <Search className="h-4 w-4 shrink-0 opacity-50" />
                        </div>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card border-border">
                <DialogHeader className="p-4 border-b border-border">
                    <DialogTitle className="text-xl font-semibold">
                        Select {singularize(resourceName)}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Search and select a {singularize(resourceName)} for this
                        relationship.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex border-b border-border">
                    <button
                        type="button"
                        className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors",
                            tab === "search"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => setTab("search")}
                    >
                        Search Existing
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "flex-1 py-3 text-sm font-medium transition-colors",
                            tab === "create"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                        onClick={() => setTab("create")}
                    >
                        Add New
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {tab === "search" ? (
                        <div className="p-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Type to search..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e: any) =>
                                        handleSearch(e.target.value)
                                    }
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-1">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                    </div>
                                ) : options.length > 0 ? (
                                    options.map((option: any) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
                                            onClick={(e: any) =>
                                                handleSelect(option, e)
                                            }
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">
                                                    {option.label}
                                                </span>
                                                {option.description && (
                                                    <span className="text-xs text-gray-500">
                                                        {option.description}
                                                    </span>
                                                )}
                                            </div>
                                            {value === option.value && (
                                                <Check className="h-4 w-4 text-blue-600" />
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {searchTerm
                                            ? "No results found."
                                            : "Start typing to search..."}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            <ResourceForm
                                data={formData}
                                setData={setData}
                                errors={errors}
                                onSubmit={handleCreate}
                                processing={creating}
                                updating={false}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RelationshipSelector;
