import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    User,
    Pencil,
    Trash2,
    ArrowLeft,
    Calendar,
    Clock,
    AlertTriangle,
    Activity as ActivityIcon,
    Phone,
    Mail,
    Users,
    MessageSquare,
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

const TypeIcon = ({ type }: any) => {
    switch (type?.toLowerCase()) {
        case "call":
            return <Phone className="h-5 w-5" />;
        case "email":
            return <Mail className="h-5 w-5" />;
        case "meeting":
            return <Users className="h-5 w-5" />;
        default:
            return <MessageSquare className="h-5 w-5" />;
    }
};

const Show = ({ activity }: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(
            route("activities.destroy", {
                organization: organizationSlug,
                activity: activity.data.id,
            }),
            {
                onStart: () => setIsDeleting(true),
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    asChild
                    className="pl-0 hover:bg-transparent"
                >
                    <Link
                        href={route("activities.index", {
                            organization: organizationSlug,
                        })}
                        className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Activities
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        asChild
                        data-testid="activity-edit-btn"
                    >
                        <Link
                            href={route("activities.edit", {
                                organization: organizationSlug,
                                activity: activity.data.id,
                            })}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>

                    <Dialog
                        open={openDeleteModal}
                        onOpenChange={setOpenDeleteModal}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                data-testid="activity-delete-btn"
                            >
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
                                    Are you sure you want to delete this
                                    activity record? This action cannot be
                                    undone.
                                </p>
                            </div>
                            <div className="flex justify-center gap-4 mt-4">
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                    data-testid="activity-delete-confirm"
                                >
                                    {isDeleting
                                        ? "Deleting..."
                                        : "Yes, I'm sure"}
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
                                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg text-purple-600 dark:text-purple-300">
                                    <TypeIcon type={activity.data.type} />
                                </div>
                                <div>
                                    <h1
                                        className="text-3xl font-bold text-foreground capitalize"
                                        data-testid="activity-heading"
                                    >
                                        {activity.data.type} Activity
                                    </h1>
                                    <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(
                                                activity.data.date,
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {activity.data.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">
                                    Activity Notes
                                </h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-background/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                    {activity.data.description ||
                                        "No notes provided."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-border">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                                        Contact Involved
                                    </h3>
                                    {activity.data.contact_id ? (
                                        <Link
                                            href={route("contacts.show", {
                                                organization: organizationSlug,
                                                contact:
                                                    activity.data.contact_id,
                                            })}
                                            className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                        >
                                            <User className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-blue-600">
                                                    {
                                                        activity.data
                                                            .contact_fullname
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    View contact details
                                                </p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No contact linked
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                                        Related Lead
                                    </h3>
                                    {activity.data.lead_id ? (
                                        <Link
                                            href={route("leads.show", {
                                                organization: organizationSlug,
                                                lead: activity.data.lead_id,
                                            })}
                                            className="group flex items-center p-3 rounded-lg border border-border hover:border-blue-500 transition-colors"
                                        >
                                            <ActivityIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-blue-600">
                                                    {
                                                        activity.data
                                                            .lead_description
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    View lead details
                                                </p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No lead linked
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">
                            Activity Info
                        </h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Type
                                </dt>
                                <dd
                                    className="text-base font-semibold text-foreground mt-1 capitalize"
                                    data-testid="activity-type-label"
                                >
                                    {activity.data.type}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Date
                                </dt>
                                <dd className="text-base text-foreground mt-1">
                                    {new Date(
                                        activity.data.date,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Time
                                </dt>
                                <dd className="text-base text-foreground mt-1">
                                    {activity.data.time}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

Show.layout = (page: any) => (
    <Layout>
        <ResourceLayout
            children={page}
            title={`Activity Details`}
            hideHeader={true}
        />
    </Layout>
);

export default Show;
