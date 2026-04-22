import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    Shield, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Calendar,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";

const Show = ({ role }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("roles.destroy", role.data.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    // Group permissions by category (first part of the name before dot or space)
    const groupedPermissions = role.data.permissions.reduce((acc, permission) => {
        const parts = permission.name.split('.');
        const category = parts.length > 1 ? parts[0] : 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(permission);
        return acc;
    }, {});

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href={route("roles.index")} className="flex items-center text-gray-500 hover:text-muted-foreground dark:hover:text-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Roles
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={route("roles.edit", role.data.id)}>
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
                                    Are you sure you want to delete role <strong>{role.data.name}</strong>? This action cannot be undone.
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

            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-4 mb-8 border-b pb-6">
                    <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg text-orange-600 dark:text-orange-300">
                        <Shield className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground capitalize">{role.data.name}</h1>
                        <p className="text-muted-foreground flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created on {new Date(role.data.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-foreground">Assigned Permissions</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                <div key={category} className="space-y-3 p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                                    <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400 border-b pb-2 mb-3 capitalize">
                                        {category}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                {permission.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {role.data.permissions.length === 0 && (
                            <div className="text-center py-12 bg-background/50 rounded-lg border-2 border-dashed border-border">
                                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 italic">No permissions assigned to this role.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Show.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title={`Role: ${page.props.role.data.name}`} />
    </Layout>
);

export default Show;
