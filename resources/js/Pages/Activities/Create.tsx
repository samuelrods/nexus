import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import ActivityForm from "./Form";

const Create = () => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const { data, setData, post, processing, errors } = useForm({
        contact_id: null,
        lead_id: null,
        type: "call",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        description: "",
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        post(route("activities.store", { organization: organizationSlug }));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <ActivityForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={onSubmit}
                processing={processing}
            />
        </div>
    );
};

Create.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Create Activity" />
    </Layout>
);

export default Create;
