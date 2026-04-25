// @ts-nocheck
import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, Link, usePage } from "@inertiajs/react";
import RoleForm from "./Form";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, ShieldPlus } from "lucide-react";

const Create = ({ permissions }: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [],
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        post(route("roles.store", { organization: organizationSlug }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        asChild
                        className="pl-0 hover:bg-transparent -ml-2 mb-2 group"
                    >
                        <Link
                            href={route("roles.index", {
                                organization: organizationSlug,
                            })}
                            className="flex items-center text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Roles
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <ShieldPlus className="h-6 w-6" />
                        </div>
                        Create New Role
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Define a new set of permissions for your team members.
                    </p>
                </div>
            </div>

            <RoleForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={onSubmit}
                processing={processing}
                permissionsData={permissions}
            />
        </div>
    );
};

Create.layout = (page: any) => (
    <Layout title="Create Role">
        <ResourceLayout children={page} title="Create Role" hideHeader={true} />
    </Layout>
);

export default Create;
