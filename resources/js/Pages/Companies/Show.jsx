import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    Building2, 
    Globe, 
    Factory, 
    MapPin, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    AlertTriangle
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";

const Show = ({ company }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("companies.destroy", company.data.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("companies.index")} className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("companies.edit", company.data.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    
                    <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
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
                                    Are you sure you want to delete <strong>{company.data.name}</strong>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center gap-4 mt-4">
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? "Deleting..." : "Yes, I'm sure"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setOpenDeleteModal(false)}
                                >
                                    No, cancel
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                    <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{company.data.name}</h1>
                                    <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                        <Factory className="h-4 w-4 mr-1" />
                                        {company.data.industry}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {company.data.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Website</h3>
                                    <a 
                                        href={company.data.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <Globe className="h-4 w-4 mr-2" />
                                        {company.data.website}
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Location</h3>
                                    <p className="text-gray-700 dark:text-gray-300 flex items-start">
                                        <MapPin className="h-4 w-4 mr-2 mt-1 shrink-0" />
                                        <span>
                                            {company.data.address.street_address}<br />
                                            {company.data.address.city}, {company.data.address.state} {company.data.address.zip_code}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2">Details</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</dt>
                                <dd className="text-base text-gray-900 dark:text-white">{company.data.industry}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Added On</dt>
                                <dd className="text-base text-gray-900 dark:text-white flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {new Date(company.data.created_at).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

Show.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title={`Company: ${page.props.company.data.name}`} />
    </Layout>
);

export default Show;
