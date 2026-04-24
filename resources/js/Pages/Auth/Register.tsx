import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";

const Register = () => {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post(route("register"));
    }

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-card shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="username">Username</Label>
                        </div>
                        <Input
                            id="username"
                            data-testid="register-username"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            type="text"
                            placeholder="cskiles"
                            required
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="first_name"
                                >
                                    First name
                                </Label>
                            </div>
                            <Input
                                id="first_name"
                                data-testid="register-first-name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                                type="text"
                                placeholder="Oren"
                                required
                            />
                            <InputError message={errors.first_name} className="mt-2" />
                        </div>
                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="last_name">Last name</Label>
                            </div>
                            <Input
                                id="last_name"
                                data-testid="register-last-name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                                type="text"
                                placeholder="Emmerich"
                                required
                            />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email">Email</Label>
                        </div>
                        <Input
                            id="email"
                            data-testid="register-email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            type="email"
                            placeholder="name@example.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                            value={data.password}
                            data-testid="register-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            id="password"
                            type="password"
                            placeholder="********"
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="password_confirmation"
                            >
                                Confirmation Password
                            </Label>
                        </div>
                        <Input
                            id="password_confirmation"
                            data-testid="register-password-confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            type="password"
                            placeholder="********"
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                    <div className="flex w-full justify-end items-center gap-3">
                        <Link
                            href="/login"
                            className="underline text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Already registered?
                        </Link>
                        <Button
                            disabled={processing}
                            type="submit"
                            data-testid="register-submit"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
