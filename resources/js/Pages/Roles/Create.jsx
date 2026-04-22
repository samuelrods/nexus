import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import RoleForm from "./Form";

const Create = ({ permissions }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("roles.store"));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">


            <RoleForm                data={data}
                setData={setData}
                errors={errors}
                onSubmit={onSubmit}
                processing={processing}
                permissionsData={permissions}
            />
        </div>
    );
};

Create.layout = (page) => (
    <Layout>
        <ResourceLayout children={page} title="Create Role" />
    </Layout>
);

export default Create;
