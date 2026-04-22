import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    Building2, 
    User, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Calendar,
    AlertTriangle,
    Tag,
    Activity
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
    const statusStyles = {
        open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        converted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };

    const style = statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-sm font-medium capitalize", style)}>
            {status}
        </span>
    );
};

const Show = ({ lead }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("leads.destroy", lead.data.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("leads.index")} className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Leads
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("leads.edit", lead.data.id)}>
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
                                    Are you sure you want to delete this lead? This action cannot be undone.
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
                                    <Activity className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">Lead Details</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <StatusBadge status={lead.data.status} />
                                        <span className="text-gray-400">|</span>
                                        <span className="text-muted-foreground flex items-center">
                                            <Tag className="h-4 w-4 mr-1" />
                                            Source: {lead.data.source}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {lead.data.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-border">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Related Company</h3>
                                    {lead.data.company_id ? (
                                        <Link 
                                            href={route('companies.show', lead.data.company_id)}
                                            className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                        >
                                            <Building2 className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-blue-600">{lead.data.company_name}</p>
                                                <p className="text-sm text-gray-500">View company details</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="text-gray-500 italic">No company linked</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Related Contact</h3>
                                    {lead.data.contact_id ? (
                                        <Link 
                                            href={route('contacts.show', lead.data.contact_id)}
                                            className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                        >
                                            <User className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-blue-600">{lead.data.contact_fullname}</p>
                                                <p className="text-sm text-gray-500">View contact details</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="text-gray-500 italic">No contact linked</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">Information</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                                <dd className="text-base text-foreground flex items-center mt-1">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {new Date(lead.data.created_at).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                <dd className="mt-1">
                                    <StatusBadge status={lead.data.status} />
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Lead Source</dt>
                                <dd className="text-base text-foreground mt-1 capitalize">{lead.data.source}</dd>
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
        <ResouceLayout children={page} title={`Lead Details`} hideHeader={true} />
    </Layout>
);

export default Show;
