import { router, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Table as TableUI,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useEffect, useState } from "react";
import { Pencil, Trash2, AlertTriangle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        won: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };

    const style = statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", style)}>
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
}) {
    const [openModal, setOpenModal] = useState(false);
    const {
        data,
        setData,
        put,
        processing,
        setDefaults,
        errors,
        reset,
    } = useForm(
        Object.fromEntries(resourceInfoKeys.map((key) => [key, item[key]])),
    );

    function onCloseModal() {
        setOpenModal(false);
    }

    useEffect(() => {
        if (!openModal) {
            reset();
        }
    }, [openModal]);

    function submit(e) {
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
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Resource</DialogTitle>
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

function DeleteButton({ resourceRoute }) {
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
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                        Confirm Deletion
                    </DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this resource? This action cannot be undone.
                    </p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        variant="destructive"
                        disabled={processing}
                        onClick={handleDelete}
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
}) => {
    const getPropertyByPath = (obj, path) => {
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
    return (
        <div className="relative overflow-hidden shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
            <TableUI className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <TableHeader className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <TableRow className="border-b dark:border-gray-700">
                        {columns.map((column) => (
                            <TableHead key={column.key} className="px-6 py-3 font-semibold">
                                {column.header}
                            </TableHead>
                        ))}
                        <TableHead className="px-6 py-3 text-right font-semibold">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <TableRow
                                key={resourceName + "-" + item.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.key + "body"} className="px-6 py-4 whitespace-nowrap">
                                        {column.key === "status" ? (
                                            <StatusBadge status={item[column.key]} />
                                        ) : (
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {item[column.key] ?? "—"}
                                            </span>
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <EditButton
                                            item={item}
                                            resourceRoute={route(
                                                resourceName + ".update",
                                                item.id,
                                            )}
                                            EditResourceForm={EditResourceForm}
                                            editFormData={editFormData}
                                            resourceInfoKeys={resourceInfoKeys}
                                        />
                                        <DeleteButton
                                            resourceRoute={route(
                                                resourceName + ".destroy",
                                                propertyIdPath
                                                    ? getPropertyByPath(
                                                          item,
                                                          propertyIdPath,
                                                      )
                                                    : item.id,
                                            )}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="py-20 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Inbox className="h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No data found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or add a new {resourceName.slice(0, -1)}.</p>
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
