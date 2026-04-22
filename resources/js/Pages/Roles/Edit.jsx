import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import RoleForm from "./Form";

const Edit = ({ role, permissions }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: role.data.name,
        permissions: role.data.permissions.map(p => p.id) || [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.data.id));
    };

    return (
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-sm border border-border">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-foreground">Edit Role: {role.data.name}</h2>
                <p className="text-muted-foreground">Update the role name and permissions.</p>
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
    <Layout>
        <ResouceLayout children={page} title="Edit Role" />
    </Layout>
);

export default Edit;
