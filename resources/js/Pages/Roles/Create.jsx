import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
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
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Role</h2>
                <p className="text-gray-500 dark:text-gray-400">Define a new role and its associated permissions.</p>
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

Create.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Create Role" />
    </Layout>
);

export default Create;
