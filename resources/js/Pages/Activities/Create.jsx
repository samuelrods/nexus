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
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-sm border border-border">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-foreground">Record New Activity</h2>
                <p className="text-muted-foreground">Log a call, email, or meeting with a contact.</p>
            </div>
            
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

Create.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Create Activity" />
    </Layout>
);

export default Create;
