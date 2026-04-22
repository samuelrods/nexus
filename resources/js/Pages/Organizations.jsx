import Alert from "@/Shared/Alert";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import CreateOrganizationModal from "@/Components/CreateOrganizationModal";
import { 
    MailOpen, 
    Building2, 
    Users, 
    Handshake, 
    Plus, 
    ArrowRight, 
    LogOut, 
    Trash2,
    Crown,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";

const OrganizationCard = ({ membership }) => {
    const { auth } = usePage().props;
    const organization = membership.organization;
    const isOwner = auth.user.id === organization.user_id;
    const isSelected = auth.organization && auth.organization.id === organization.id;

    const handleSelect = () => {
        router.put(route("users.organization"), {
            organization_id: organization.id,
        });
    };

    const handleDeleteOrLeave = () => {
        if (isOwner) {
            if (confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
                router.delete(route("organizations.destroy", organization.id));
            }
        } else {
            if (confirm("Are you sure you want to leave this organization?")) {
                router.delete(route("members.destroy", membership.id));
            }
        }
    };

    const initials = organization.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-border/50",
            isSelected && "ring-2 ring-blue-500 border-blue-500/50 shadow-blue-500/10"
        )}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <Avatar className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        <AvatarFallback className="rounded-lg bg-transparent font-bold text-lg">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    {isSelected && (
                        <Badge variant="default" className="bg-blue-600 text-white animate-in fade-in zoom-in duration-300">
                            Active
                        </Badge>
                    )}
                </div>
                <div className="mt-4">
                    <CardTitle className="text-xl font-bold line-clamp-1">{organization.name}</CardTitle>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        {isOwner ? (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 h-5 border-yellow-500/50 text-yellow-600 bg-yellow-500/5">
                                <Crown className="w-3 h-3 mr-1" /> Owner
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider py-0 px-2 h-5 border-blue-500/50 text-blue-600 bg-blue-500/5">
                                <User className="w-3 h-3 mr-1" /> Member
                            </Badge>
                        )}
                        <span className="mx-2 opacity-30">•</span>
                        <span className="flex items-center">
                            <Building2 className="w-3 h-3 mr-1" /> {organization.user.username}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-6">
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50 my-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Members</span>
                        <div className="flex items-center mt-1">
                            <Users className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-semibold">{organization.members_count || 0}</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Deals</span>
                        <div className="flex items-center mt-1">
                            <Handshake className="w-4 h-4 mr-2 text-green-500" />
                            <span className="font-semibold">{organization.deals_count || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors"
                        onClick={handleSelect}
                        disabled={isSelected}
                    >
                        {isSelected ? "Current" : "Enter"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={handleDeleteOrLeave}
                        title={isOwner ? "Delete Organization" : "Leave Organization"}
                    >
                        {isOwner ? <Trash2 className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const InvitationItem = ({ invitation }) => {
    const handleInvitation = (accepted) => {
        router.put(route("invitations.update", invitation.id), {
            status: accepted,
        });
    };

    return (
        <Card className="border-blue-500/20 bg-blue-500/5 overflow-hidden border-dashed">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-600">
                        <MailOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{invitation.organization.name}</h4>
                        <p className="text-xs text-muted-foreground">
                            Invited by <span className="font-medium text-foreground">{invitation.organization.user.username}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 h-8"
                        onClick={() => handleInvitation(true)}
                    >
                        Accept
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8"
                        onClick={() => handleInvitation(false)}
                    >
                        Decline
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


const Organizations = ({ memberships, invitations }) => {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <Head title="Select Organization" />
            
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">N</div>
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600/70">Nexus CRM</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                            Welcome back
                        </h1>
                        <p className="mt-3 text-lg text-muted-foreground max-w-lg">
                            Choose an organization to start managing your deals and contacts.
                        </p>
                    </div>
                    <CreateOrganizationModal />
                </div>

                {invitations.length > 0 && (
                    <div className="mb-12 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600/80">Pending Invitations</h2>
                            <div className="h-px flex-1 bg-blue-500/10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {invitations.map((invitation) => (
                                <InvitationItem key={"inv-" + invitation.id} invitation={invitation} />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Your Organizations</h2>
                        <div className="h-px flex-1 bg-border/50" />
                    </div>

                    {memberships.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                            {memberships.map((membership) => (
                                <OrganizationCard
                                    key={membership.organization.id}
                                    membership={membership}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed py-20 bg-muted/30">
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <div className="h-20 w-20 bg-background rounded-full flex items-center justify-center border border-border shadow-inner mb-6">
                                    <Building2 className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No organizations yet</h3>
                                <p className="text-muted-foreground max-w-sm mb-8">
                                    Get started by creating your first organization to manage your business.
                                </p>
                                <CreateOrganizationModal />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
            <Alert />
        </div>
    );
};

export default Organizations;

