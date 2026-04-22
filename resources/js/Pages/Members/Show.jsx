import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    User, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Mail,
    Shield,
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

const Show = ({ member }) => {
    const memberData = member?.data ?? member;
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("members.destroy", memberData?.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("members.index")} className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Members
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("members.edit", memberData?.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    
                    <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-card">
                            <DialogHeader>
                                <DialogTitle className="flex flex-col items-center text-foreground">
                                    <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                                    Remove Member
                                </DialogTitle>
                            </DialogHeader>
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">
                                    Are you sure you want to remove <strong>{memberData?.full_name}</strong> from this organization?
                                </p>
                            </div>
                            <div className="flex justify-center gap-4 mt-4">
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? "Removing..." : "Yes, remove"}
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
                        <div className="flex items-start gap-6 mb-8 border-b pb-6">
                            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full text-blue-600 dark:text-blue-300">
                                <User className="h-12 w-12" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{memberData?.full_name}</h1>
                                <p className="text-muted-foreground flex items-center mt-1">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {memberData?.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Organization Role</h3>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-purple-500" />
                                    <span className="text-lg font-semibold text-foreground">{memberData?.role_name}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Member Since</h3>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <span>Joined the organization</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">Profile Info</h3>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
                                <dd className="text-base font-medium text-foreground mt-1">{memberData?.first_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                                <dd className="text-base font-medium text-foreground mt-1">{memberData?.last_name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Email Address</dt>
                                <dd className="text-base font-medium text-foreground mt-1 truncate">{memberData?.email}</dd>
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
        <ResouceLayout children={page} title={`Member: ${page.props.member?.full_name ?? page.props.member?.data?.full_name}`} hideHeader={true} />
    </Layout>
);

export default Show;
