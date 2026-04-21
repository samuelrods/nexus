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
import { Pencil, Trash2, AlertTriangle } from "lucide-react";

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
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
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
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
        <div className="rounded-md border overflow-hidden">
            <TableUI>
                <TableHeader className="bg-blue-600 dark:bg-gray-700">
                    <TableRow className="hover:bg-transparent border-none">
                        {columns.map((column) => (
                            <TableHead key={column.key} className="text-white dark:text-gray-200 uppercase font-bold px-6 py-3">
                                {column.header}
                            </TableHead>
                        ))}
                        <TableHead className="text-white dark:text-gray-200 uppercase font-bold px-6 py-3 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <TableRow
                                key={resourceName + "-" + item.id}
                                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.key + "body"} className="px-6 py-4">
                                        {item[column.key] ?? "Not yet"}
                                    </TableCell>
                                ))}
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
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
                            <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </TableUI>
        </div>
    );
};

export default Table;
