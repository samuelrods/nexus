import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";

const Login = ({ status, canResetPassword }: any) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: any) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-card shadow-md overflow-hidden sm:rounded-lg">
                <Head title="Log in" />

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            autoFocus
                            onChange={(e: any) => setData("email", e.target.value)}
                            data-testid="login-email"
                        />
                        <InputError
                            message={errors.email}
                            className="mt-2"
                            data-testid="login-error-email"
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="password">Password</Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e: any) =>
                                setData("password", e.target.value)
                            }
                            data-testid="login-password"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                            data-testid="login-error-password"
                        />
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked: any) =>
                                    setData("remember", checked)
                                }
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm font-normal text-muted-foreground"
                            >
                                Remember me
                            </Label>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <Button
                            type="submit"
                            className="ml-4"
                            disabled={processing}
                            data-testid="login-submit"
                        >
                            Log in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
