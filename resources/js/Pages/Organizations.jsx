import Alert from "@/Shared/Alert";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";
import { MailOpen, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const OrganizationItem = ({ membership }) => {
    const [openModal, setOpenModal] = useState(false);
    const { auth } = usePage().props;

    const organization = membership.organization;

    const handleOrganizationSelection = () => {
        setOpenModal(false);

        router.put(route("users.organization"), {
            organization_id: organization.id,
        });
    };

    const handleOrganizationDeletion = () => {
        setOpenModal(false);

        if (auth.user.id === organization.user_id) {
            return router.delete(route("organizations.destroy", organization.id));
        }

        router.delete(route("members.destroy", membership.id));
    };

    const isSelected = auth.organization && auth.organization.id === organization.id;

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "capitalize min-w-[200px] relative h-12",
                        isSelected && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    )}
                >
                    <Building2 className="mr-2 h-4 w-4" />
                    {organization.name}
                    {isSelected && (
                        <span className="bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider py-0.5 px-2 rounded-full absolute -top-2 -right-2 shadow-sm">
                            Selected
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold capitalize text-center">
                        {organization.name}
                    </DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Owner</h2>
                        <p className="text-lg text-gray-900 dark:text-gray-100">{organization.user.username}</p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleOrganizationSelection}
                        >
                            Choose
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleOrganizationDeletion}
                        >
                            {auth.user.id === organization.user_id
                                ? "Delete"
                                : "Leave"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const InvitationItem = ({ invitation }) => {
    const [openModal, setOpenModal] = useState(false);

    const handleInvitation = (accepted) => {
        setOpenModal(false);

        router.put(route("invitations.update", invitation.id), {
            status: accepted,
        });
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-12 min-w-[200px]">
                    <MailOpen className="mr-2 h-4 w-4" />
                    {invitation.organization.name}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="hidden">Invitation</DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                    <MailOpen className="mx-auto mb-4 h-14 w-14 text-blue-500 opacity-80" />
                    <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-gray-100">
                        You have been invited to join <span className="font-bold">{invitation.organization.name}</span>
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 px-8"
                            onClick={() => handleInvitation(true)}
                        >
                            Join Now
                        </Button>
                        <Button
                            variant="outline"
                            className="px-8"
                            onClick={() => handleInvitation(false)}
                        >
                            Decline
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const CreateOrganizationModal = () => {
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState("");

    function onCloseModal() {
        setOpenModal(false);
        setName("");
    }

    function onSubmit(e) {
        e.preventDefault();

        router.post(route("organizations.store"), {
            name,
        });
        onCloseModal();
    }

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create Organization</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter Organization Name"
                            autoComplete="off"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Create
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Organizations = ({ memberships, invitations }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Head title="Organizations" />
            <div className="flex-1 flex justify-center items-center p-4">
                <Card className="w-full max-w-xl shadow-xl border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-8">
                        <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Organizations
                        </CardTitle>
                        <CreateOrganizationModal />
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        {memberships.length ? (
                            <div className="space-y-4 flex flex-col items-center">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest w-full text-center">Your Memberships</h2>
                                <div className="flex flex-col gap-3 w-full items-center">
                                    {memberships.map((membership) => (
                                        <OrganizationItem
                                            key={membership.organization.id}
                                            membership={membership}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>You are not a member of any organization yet.</p>
                            </div>
                        )}

                        {invitations.length ? (
                            <div className="mt-10 space-y-4 flex flex-col items-center">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest w-full text-center">Pending Invitations</h2>
                                <div className="flex flex-col gap-3 w-full items-center">
                                    {invitations.map((invitation) => (
                                        <InvitationItem
                                            key={"inv-" + invitation.id}
                                            invitation={invitation}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
            <Alert />
        </div>
    );
};

export default Organizations;
