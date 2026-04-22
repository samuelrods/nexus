import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, Link, usePage } from "@inertiajs/react";
import RoleForm from "./Form";
import { Button } from "@/Components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

const Edit = ({ role, permissions }) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const { data, setData, put, processing, errors } = useForm({
        name: role.data.name,
        permissions: role.data.permissions.map(p => p.id) || [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", { organization: organizationSlug, role: role.data.id }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent -ml-2 mb-2 group">
                        <Link href={route("roles.show", { organization: organizationSlug, role: role.data.id })} className="flex items-center text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Role
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Shield className="h-6 w-6" />
                        </div>
                        Edit Role: <span className="capitalize">{role.data.name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Adjust permissions and configuration for this role.</p>
                </div>
            </div>

            <RoleForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={onSubmit}
                processing={processing}
                permissionsData={permissions}
                updating={true}
            />
        </div>
    );
};

Edit.layout = (page) => (
    <Layout title={`Edit Role: ${page.props.role.data.name}`}>
        <ResourceLayout children={page} title="Edit Role" hideHeader={true} />
    </Layout>
);

export default Edit;
