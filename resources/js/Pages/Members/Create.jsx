import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Loader2, ArrowLeft, Send } from "lucide-react";

const Create = () => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const { data, setData, post, processing, errors } = useForm({
        memberInfo: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("members.store", { organization: organizationSlug }));
    };

    return (
        <div className="max-w-2xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Invite Member</h2>
                    <p className="text-muted-foreground">Send an invitation to a user to join your organization.</p>
                </div>
                <Button variant="ghost" asChild>
                    <Link href={route("members.index", { organization: organizationSlug })}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="memberInfo">Username or Email</Label>
                    <Input
                        id="memberInfo"
                        placeholder="Enter username or email address"
                        value={data.memberInfo}
                        onChange={(e) => setData("memberInfo", e.target.value)}
                        required
                        autoComplete="off"
                        className="bg-card"
                    />
                    <InputError message={errors.memberInfo} />
                    <p className="text-xs text-muted-foreground">
                        The user must already have an account in Nexus to be invited.
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
                    >
                        {processing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        {processing ? "Sending..." : "Send Invitation"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

Create.layout = (page) => (
    <Layout>
        <ResourceLayout children={page} title="Invite Member" />
    </Layout>
);

export default Create;
