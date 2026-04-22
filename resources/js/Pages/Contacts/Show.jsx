import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    User, 
    Mail, 
    Phone, 
    Building2, 
    Briefcase, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Calendar,
    AlertTriangle,
    Info
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";

const Show = ({ contact }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("contacts.destroy", contact.data.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("contacts.index")} className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Contacts
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("contacts.edit", contact.data.id)}>
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
                                <p className="text-muted-foreground">
                                    Are you sure you want to delete <strong>{contact.data.full_name}</strong>? This action cannot be undone.
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
                    <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                                    <User className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{contact.data.full_name}</h1>
                                    <p className="text-muted-foreground flex items-center mt-1">
                                        <Briefcase className="h-4 w-4 mr-1" />
                                        {contact.data.job_title} at {contact.data.organization_name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {contact.data.description || "No description provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Email</h3>
                                    <a 
                                        href={`mailto:${contact.data.email}`} 
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        {contact.data.email}
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Phone</h3>
                                    <p className="text-muted-foreground flex items-center">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {contact.data.phone_number}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2 flex items-center">
                            <Info className="h-5 w-5 mr-2" />
                            Details
                        </h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Organization</dt>
                                <dd className="text-base text-foreground flex items-center">
                                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                                    {contact.data.organization_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Job Title</dt>
                                <dd className="text-base text-foreground">{contact.data.job_title}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Added On</dt>
                                <dd className="text-base text-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {new Date(contact.data.created_at).toLocaleDateString()}
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
        <ResourceLayout children={page} title={`Contact: ${page.props.contact.data.full_name}`} hideHeader={true} />
    </Layout>
);

export default Show;
