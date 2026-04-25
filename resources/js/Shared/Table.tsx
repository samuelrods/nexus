// @ts-nocheck
import { router, Link, useForm, usePage } from "@inertiajs/react";
import {
    Table as TableUI,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    Inbox,
    ChevronRight,
    Pencil,
    Trash2,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import singularize from "@/Shared/utils/singularize";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

const StatusBadge = ({ status }: any) => {
    const statusStyles = {
        pending:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50",
        won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
        lost: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
        active: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-900/50",
        inactive:
            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
        closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
        converted:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900/50",
        // Member Roles
        owner: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
        admin: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50",
        member: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    };

    const style =
        statusStyles[status?.toLowerCase()] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";

    return (
        <span
            className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold capitalize border",
                style,
            )}
        >
            {status}
        </span>
    );
};

function EditButton({
    item,
    resourceRoute,
    EditResourceForm,
    editFormData,
    resourceInfoKeys,
}: any) {
    const [openModal, setOpenModal] = useState(false);
    const { data, setData, put, processing, setDefaults, errors, reset } =
        useForm(
            Object.fromEntries(resourceInfoKeys.map((key: any) => [key, item[key]])),
        );

    function onCloseModal() {
        setOpenModal(false);
    }

    useEffect(() => {
        if (!openModal) {
            reset();
        }
    }, [openModal]);

    function submit(e: any) {
        e.preventDefault();
        put(resourceRoute, {
            onSuccess: () => {
                onCloseModal();
                setDefaults();
            },
        });
    }

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        Edit Resource
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <EditResourceForm
                        item={item}
                        formData={editFormData}
                        data={data}
                        setData={setData}
                        errors={errors}
                        onSubmit={submit}
                        processing={processing}
                        updating={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DeleteButton({ resourceRoute }: any) {
    const [openModal, setOpenModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleDelete = () => {
        router.delete(resourceRoute, {
            preserveState: true,
            onProgress: () => setProcessing(true),
            onSuccess: () => {
                setProcessing(false);
                setOpenModal(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card">
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-center text-foreground">
                        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                        Confirm Deletion
                    </DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                    <p className="text-muted-foreground">
                        Are you sure you want to delete this resource? This
                        action cannot be undone.
                    </p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        variant="destructive"
                        disabled={processing}
                        onClick={handleDelete}
                        data-testid="delete-confirm"
                    >
                        Yes, I'm sure
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setOpenModal(false)}
                    >
                        No, cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const Table = ({
    data,
    columns,
    resourceName,
    propertyIdPath,
    EditResourceForm,
    editFormData,
    resourceInfoKeys,
    filters = {},
}) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const getPropertyByPath = (obj: any, path: any) => {
        const keys = path.split(".");
        let result = obj;

        for (const key of keys) {
            if (result && typeof result === "object" && key in result) {
                result = result[key];
            } else {
                return undefined;
            }
        }

        return result;
    };

    const handleRowClick = (item: any) => {
        const showRoute = `${resourceName}.show`;
        try {
            const url = route(showRoute, {
                organization: organizationSlug,
                [singularize(resourceName)]: item.id,
            });
            if (url) {
                router.visit(url);
            }
        } catch (e) {
            console.log(`No show route for ${resourceName}`);
        }
    };

    const hasShowRoute = (resource: any) => {
        try {
            return !!route(`${resource}.show`, {
                organization: organizationSlug,
                [singularize(resource)]: 1,
            });
        } catch (e) {
            return false;
        }
    };

    const canClickRow = hasShowRoute(resourceName);

    const handleSort = (sortKey: any) => {
        if (!sortKey) return;

        let newDir = "asc";
        if (filters.sort_by === sortKey && filters.sort_dir === "asc") {
            newDir = "desc";
        }

        router.get(
            route(`${resourceName}.index`, { organization: organizationSlug }),
            { ...filters, sort_by: sortKey, sort_dir: newDir },
            { preserveState: true },
        );
    };

    const getSortIcon = (column: any) => {
        if (!column.sortKey) return null;
        if (filters.sort_by !== column.sortKey)
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        return filters.sort_dir === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4 text-blue-500" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />
        );
    };

    return (
        <div className="relative overflow-hidden shadow-md sm:rounded-lg border border-border">
            <TableUI className="w-full text-sm text-left text-muted-foreground">
                <TableHeader className="text-xs text-muted-foreground uppercase bg-muted">
                    <TableRow className="border-b border-border">
                        {columns.map((column: any) => (
                            <TableHead
                                key={column.key}
                                className={cn(
                                    "px-6 py-3 font-semibold",
                                    column.sortKey &&
                                        "cursor-pointer hover:bg-muted/80 transition-colors",
                                )}
                                onClick={() => handleSort(column.sortKey)}
                            >
                                <div className="flex items-center">
                                    {column.header}
                                    {getSortIcon(column)}
                                </div>
                            </TableHead>
                        ))}
                        <TableHead className="px-6 py-3 text-right font-semibold">
                            {EditResourceForm ? "Actions" : ""}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item: any) => (
                            <TableRow
                                key={resourceName + "-" + item.id}
                                data-testid={`table-row-${item.id}`}
                                className={cn(
                                    "bg-card border-b border-border hover:bg-muted/50 transition-colors",
                                    canClickRow && "cursor-pointer",
                                )}
                                onClick={() =>
                                    canClickRow && handleRowClick(item)
                                }
                            >
                                {columns.map((column: any) => (
                                    <TableCell
                                        key={column.key + "body"}
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        {column.render ? (
                                            column.render(
                                                item[column.key],
                                                item,
                                            )
                                        ) : column.key === "status" ||
                                          column.key === "type" ||
                                          column.key === "role_name" ? (
                                            <StatusBadge
                                                status={item[column.key]}
                                            />
                                        ) : column.key === "full_name" ||
                                          column.key === "name" ? (
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-border">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                        {item[column.key]
                                                            ?.split(" ")
                                                            .map((n: any) => n[0])
                                                            .join("")
                                                            .toUpperCase()
                                                            .substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-foreground font-semibold">
                                                    {item[column.key] ?? "—"}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-foreground font-medium">
                                                {item[column.key] ?? "—"}
                                            </span>
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell
                                    className="px-6 py-4 text-right"
                                    onClick={(e: any) => e.stopPropagation()}
                                >
                                    {EditResourceForm ? (
                                        <div className="flex justify-end gap-1">
                                            <EditButton
                                                item={item}
                                                resourceRoute={route(
                                                    resourceName + ".update",
                                                    {
                                                        organization:
                                                            organizationSlug,
                                                        [singularize(
                                                            resourceName,
                                                        )]: item.id,
                                                    },
                                                )}
                                                EditResourceForm={
                                                    EditResourceForm
                                                }
                                                editFormData={editFormData}
                                                resourceInfoKeys={
                                                    resourceInfoKeys
                                                }
                                            />
                                            <DeleteButton
                                                resourceRoute={route(
                                                    resourceName + ".destroy",
                                                    {
                                                        organization:
                                                            organizationSlug,
                                                        [singularize(
                                                            resourceName,
                                                        )]: propertyIdPath
                                                            ? getPropertyByPath(
                                                                  item,
                                                                  propertyIdPath,
                                                              )
                                                            : item.id,
                                                    },
                                                )}
                                            />
                                        </div>
                                    ) : canClickRow ? (
                                        <ChevronRight className="h-4 w-4 inline text-muted-foreground" />
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow data-testid="table-empty">
                            <TableCell
                                colSpan={columns.length + 1}
                                className="py-20 text-center"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-foreground">
                                        No data found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Try adjusting your search or add a new{" "}
                                        {singularize(resourceName)}.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </TableUI>
        </div>
    );
};

export default Table;
