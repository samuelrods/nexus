import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import ActivityForm from "./Form";

const Edit = ({ activity }) => {
    const { data, setData, put, processing, errors } = useForm({
        contact_id: activity.data.contact_id,
        contact_fullname: activity.data.contact_fullname,
        lead_id: activity.data.lead_id,
        lead_description: activity.data.lead_description,
        type: activity.data.type,
        date: activity.data.date,
        time: activity.data.time,
        description: activity.data.description,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("activities.update", activity.data.id));
    };

    return (
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-sm border border-border">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-foreground">Edit Activity</h2>
                <p className="text-muted-foreground">Update the activity details.</p>
            </div>

            <ActivityForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={onSubmit}
                processing={processing}
                updating={true}
            />
        </div>
    );
};

Edit.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Edit Activity" />
    </Layout>
);

export default Edit;
