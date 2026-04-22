import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    User, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Mail,
    Shield,
    Calendar,
    AlertTriangle,
    BadgeCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";

const Show = ({ member }) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;
    const memberData = member?.data ?? member;
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("members.destroy", { organization: organizationSlug, member: memberData?.id }), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("members.index", { organization: organizationSlug })} className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Members
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("members.edit", { organization: organizationSlug, member: memberData?.id })}>
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
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        <div className="px-8 pb-8">
                            <div className="relative flex justify-between items-end -mt-12 mb-6">
                                <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                        {memberData?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="pb-2">
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                                        Active Account
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-1">{memberData?.full_name}</h1>
                                <p className="text-muted-foreground flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {memberData?.email}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t">
                                <div>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Organization Role</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                                            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="text-lg font-bold text-foreground">{memberData?.role_name}</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Member Status</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                            <BadgeCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-lg font-bold text-foreground">Verified Member</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Profile Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">First Name</dt>
                                    <dd className="text-base font-medium text-foreground mt-1">{memberData?.first_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Name</dt>
                                    <dd className="text-base font-medium text-foreground mt-1">{memberData?.last_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</dt>
                                    <dd className="text-base font-medium text-foreground mt-1 truncate">{memberData?.email}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

Show.layout = (page) => (
    <Layout>
        <ResourceLayout children={page} title={`Member: ${page.props.member?.full_name ?? page.props.member?.data?.full_name}`} hideHeader={true} />
    </Layout>
);

export default Show;
