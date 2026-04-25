// @ts-nocheck
import React from "react";
import Layout from "@/Shared/Layout";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import { CheckCircle2, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

const UpdateProfileInformationForm = ({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail?: boolean;
    status?: string;
}) => {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your account's profile information and email address.
                </CardDescription>
            </CardHeader>
            <form onSubmit={submit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                data-testid="profile-first-name"
                                value={data.first_name}
                                onChange={(e: any) =>
                                    setData("first_name", e.target.value)
                                }
                                required
                                autoFocus
                                autoComplete="given-name"
                            />
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                data-testid="profile-last-name"
                                value={data.last_name}
                                onChange={(e: any) =>
                                    setData("last_name", e.target.value)
                                }
                                required
                                autoComplete="family-name"
                            />
                            <InputError message={errors.last_name} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            data-testid="profile-email"
                            type="email"
                            value={data.email}
                            onChange={(e: any) => setData("email", e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="text-sm mt-2 text-muted-foreground">
                                Your email address is unverified.
                                <Button
                                    variant="link"
                                    className="p-0 h-auto font-medium"
                                    asChild
                                >
                                    <a
                                        href={route("verification.send")}
                                        method="post"
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </a>
                                </Button>
                            </p>

                            {status === "verification-link-sent" && (
                                <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                    A new verification link has been sent to
                                    your email address.
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                    <Button
                        disabled={processing}
                        data-testid="profile-info-submit"
                    >
                        Save Changes
                    </Button>

                    {recentlySuccessful && (
                        <p
                            className="text-sm text-muted-foreground flex items-center gap-1 animate-in fade-in duration-300"
                            data-testid="profile-info-success"
                        >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Saved.
                        </p>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
};

const UpdatePasswordForm = () => {
    const passwordInput = React.useRef<HTMLInputElement>(null);
    const currentPasswordInput = React.useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        put,
        errors,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors: any) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                    Ensure your account is using a long, random password to stay
                    secure.
                </CardDescription>
            </CardHeader>
            <form onSubmit={updatePassword}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">
                            Current Password
                        </Label>
                        <Input
                            id="current_password"
                            data-testid="profile-current-password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e: any) =>
                                setData("current_password", e.target.value)
                            }
                            type="password"
                            autoComplete="current-password"
                        />
                        <InputError message={errors.current_password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            data-testid="profile-new-password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e: any) =>
                                setData("password", e.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            data-testid="profile-password-confirmation"
                            value={data.password_confirmation}
                            onChange={(e: any) =>
                                setData("password_confirmation", e.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                    <Button
                        disabled={processing}
                        data-testid="profile-password-submit"
                    >
                        Update Password
                    </Button>

                    {recentlySuccessful && (
                        <p
                            className="text-sm text-muted-foreground flex items-center gap-1 animate-in fade-in duration-300"
                            data-testid="profile-password-success"
                        >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Saved.
                        </p>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
};

const DeleteUserForm = () => {
    const [confirmingUserDeletion, setConfirmingUserDeletion] =
        React.useState(false);
    const passwordInput = React.useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: React.FormEvent) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <Card className="border-red-200 dark:border-red-900/30">
            <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                    Delete Account
                </CardTitle>
                <CardDescription>
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Before deleting your account, please download any data or
                    information that you wish to retain.
                </p>
            </CardContent>
            <CardFooter>
                <Dialog
                    open={confirmingUserDeletion}
                    onOpenChange={setConfirmingUserDeletion}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            onClick={confirmUserDeletion}
                            data-testid="profile-delete-button"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Are you sure you want to delete your account?
                            </DialogTitle>
                            <DialogDescription>
                                Once your account is deleted, all of its
                                resources and data will be permanently deleted.
                                Please enter your password to confirm you would
                                like to permanently delete your account.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={deleteUser}>
                            <div className="py-4">
                                <Label
                                    htmlFor="password"
                                    title="Password"
                                    className="sr-only"
                                />
                                <Input
                                    id="password"
                                    data-testid="profile-delete-password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e: any) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Password"
                                    className="w-full"
                                    autoFocus
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                    className="ml-2"
                                    data-testid="profile-delete-confirm"
                                >
                                    Delete Account
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
};

const Edit = ({
    status,
    mustVerifyEmail,
}: {
    status?: string;
    mustVerifyEmail?: boolean;
}) => {
    return (
        <Layout>
            <Head title="Profile" />

            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                        Profile
                    </h3>
                    <p className="text-muted-foreground">
                        Manage your account settings and profile information.
                    </p>
                </div>

                <div className="space-y-6 max-w-3xl">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                    <UpdatePasswordForm />
                    <DeleteUserForm />
                </div>
            </div>
        </Layout>
    );
};

export default Edit;
