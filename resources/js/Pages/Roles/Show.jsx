import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { 
    Shield, 
    Pencil, 
    Trash2, 
    ArrowLeft,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Users,
    ChevronRight,
    Info
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

const Show = ({ role }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = () => {
        router.delete(route("roles.destroy", role.data.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setOpenDeleteModal(false);
            },
        });
    };

    // Group permissions by category (resource name)
    const groupedPermissions = role.data.permissions.reduce((acc, permission) => {
        let action, resource;
        
        if (permission.name.includes('.')) {
            [action, resource] = permission.name.split('.');
        } else if (permission.name.includes('-')) {
            const parts = permission.name.split('-');
            action = parts[0];
            resource = parts.slice(1).join(' '); // Handle multi-word resources
        } else {
            action = permission.name;
            resource = 'General';
        }

        if (!acc[resource]) acc[resource] = [];
        acc[resource].push({ ...permission, action });
        return acc;
    }, {});

    const getActionBadge = (action) => {
        const colors = {
            read: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            create: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
            update: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
            delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        };
        
        const actionLower = action.toLowerCase();
        const colorClass = colors[actionLower] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        
        return (
            <Badge variant="none" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colorClass}`}>
                {action}
            </Badge>
        );
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent -ml-2 mb-2 group">
                        <Link href={route("roles.index")} className="flex items-center text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Roles
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground capitalize tracking-tight">{role.data.name}</h1>
                        <Badge variant="secondary" className="ml-2 font-semibold">Role</Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Created {role.data.created_at}
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" asChild className="bg-background shadow-sm">
                        <Link href={route("roles.edit", role.data.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Configuration
                        </Link>
                    </Button>
                    
                    <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="shadow-sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Role
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="flex flex-col items-center gap-2">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 mb-2">
                                        <AlertTriangle className="h-8 w-8" />
                                    </div>
                                    Confirm Deletion
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    Are you sure you want to delete the <span className="font-bold text-foreground">{role.data.name}</span> role?
                                    This action will remove this role from all assigned members and cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex sm:justify-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpenDeleteModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Permissions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Assigned Permissions
                        </h3>
                        <Badge variant="outline" className="text-muted-foreground">
                            {role.data.permissions.length} total
                        </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                            <Card key={resource} className="border-border bg-card/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                <CardHeader className="py-3 px-4 bg-muted/30 border-b">
                                    <CardTitle className="text-base font-bold capitalize flex items-center justify-between">
                                        {resource}
                                        <span className="text-[10px] bg-background/50 px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                                            {permissions.length} actions
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="group transition-transform hover:scale-105">
                                                {getActionBadge(permission.action)}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    
                    {role.data.permissions.length === 0 && (
                        <Card className="border-dashed border-2 bg-muted/10">
                            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                                <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground italic font-medium">No permissions assigned to this role.</p>
                                <Button variant="link" asChild className="mt-2">
                                    <Link href={route("roles.edit", role.data.id)}>Assign Permissions</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: Stats & Members */}
                <div className="space-y-6">
                    <Card className="border-border shadow-sm overflow-hidden">
                        <CardHeader className="pb-3 border-b bg-muted/10">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Members Assigned
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-6 text-center border-b bg-background/50">
                                <div className="text-4xl font-black text-foreground">{role.data.users_count}</div>
                                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">Total Members</div>
                            </div>
                            
                            <div className="p-4 space-y-4">
                                {role.data.users && role.data.users.length > 0 ? (
                                    <div className="space-y-3">
                                        {role.data.users.slice(0, 5).map((member) => (
                                            <Link 
                                                key={member.id} 
                                                href={route("members.show", member.id)}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                                            >
                                                <Avatar className="h-8 w-8 border border-border">
                                                    <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">
                                                        {member.first_name[0]}{member.last_name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-grow min-w-0">
                                                    <div className="text-sm font-semibold text-foreground truncate">{member.full_name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                        {role.data.users_count > 5 && (
                                            <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600 hover:text-blue-700 font-bold" asChild>
                                                <Link href={route("members.index", { role: role.data.name })}>
                                                    View all {role.data.users_count} members
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-muted-foreground italic">No members assigned yet.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Info className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Quick Tip</h4>
                                    <p className="text-blue-50 text-sm leading-relaxed">
                                        Changes to role permissions take effect immediately for all assigned members.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

Show.layout = (page) => (
    <Layout title={`Role: ${page.props.role.data.name}`}>
        <ResourceLayout children={page} title={page.props.role.data.name} hideHeader={true} />
    </Layout>
);

export default Show;
