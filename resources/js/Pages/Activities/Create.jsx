import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import ActivityForm from "./Form";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        contact_id: null,
        lead_id: null,
        type: "call",
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        description: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("activities.store"));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">


            <ActivityForm                data={data}
                setData={setData}
                errors={errors}
                onSubmit={onSubmit}
                processing={processing}
            />
        </div>
    );
};

Create.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Create Activity" />
    </Layout>
);

export default Create;
