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
    DollarSign,
    Handshake,
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
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        won: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    const style = statusStyles[status?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-sm font-medium capitalize", style)}>
            {status}
        </span>
    );
};

const Show = ({ deal }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("deals.destroy", deal.data.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("deals.index")} className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Deals
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("deals.edit", deal.data.id)}>
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
                                    Are you sure you want to delete deal <strong>{deal.data.name}</strong>? This action cannot be undone.
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
                        <div className="flex items-start justify-between mb-8 border-b pb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                                    <Handshake className="h-8 w-8 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">{deal.data.name}</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <StatusBadge status={deal.data.status} />
                                        <span className="text-gray-400">|</span>
                                        <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                            {deal.data.currency} {parseFloat(deal.data.value).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 mt-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {deal.data.description || "No description provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-border">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Linked Company</h3>
                                    {deal.data.company_id ? (
                                        <Link 
                                            href={route('companies.show', deal.data.company_id)}
                                            className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                        >
                                            <Building2 className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-blue-600">{deal.data.company_name}</p>
                                                <p className="text-sm text-gray-500">View company</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="text-gray-500 italic">No company linked</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Primary Contact</h3>
                                    {deal.data.contact_id ? (
                                        <Link 
                                            href={route('contacts.show', deal.data.contact_id)}
                                            className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                        >
                                            <User className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-blue-600">{deal.data.contact_fullname}</p>
                                                <p className="text-sm text-gray-500">View contact</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="text-gray-500 italic">No contact linked</p>
                                    )}
                                </div>
                            </div>
                            
                            {deal.data.lead_id && (
                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Originating Lead</h3>
                                    <Link 
                                        href={route('leads.show', deal.data.lead_id)}
                                        className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                    >
                                        <Activity className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                        <div>
                                            <p className="font-semibold text-foreground group-hover:text-blue-600">{deal.data.lead_description}</p>
                                            <p className="text-sm text-gray-500">View lead details</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">Financials</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Deal Value</dt>
                                <dd className="text-2xl font-bold text-foreground mt-1">
                                    {deal.data.currency} {parseFloat(deal.data.value).toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Expected Close Date</dt>
                                <dd className="text-base text-foreground flex items-center mt-1">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    {deal.data.close_date ? new Date(deal.data.close_date).toLocaleDateString() : "Not set"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                                <dd className="mt-1">
                                    <StatusBadge status={deal.data.status} />
                                </dd>
                            </div>
                        </dl>
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">History</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Added On</dt>
                                <dd className="text-sm text-foreground">
                                    {new Date(deal.data.created_at).toLocaleDateString()}
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
        <ResouceLayout children={page} title={`Deal: ${page.props.deal.data.name}`} hideHeader={true} />
    </Layout>
);

export default Show;
