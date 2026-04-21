import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";

const AddResourceModal = ({
    resourceType,
    resourceInfo,
    storeRoute,
    ResourceForm,
    formData,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm(
        Object.fromEntries(resourceInfo),
    );

    function onCloseModal() {
        setOpenModal(false);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        post(route(storeRoute), {
            onSuccess: () => {
                onCloseModal();
            },
        });
    }

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all">
                    Add {resourceType}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-medium text-gray-900 dark:text-white text-center mb-3">
                        Add {resourceType}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <ResourceForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        onSubmit={submit}
                        processing={processing}
                        formData={formData}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddResourceModal;
