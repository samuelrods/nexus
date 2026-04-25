import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import ActivityForm from "./Form";

const Edit = ({ activity }: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

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

    const onSubmit = (e: any) => {
        e.preventDefault();
        put(
            route("activities.update", {
                organization: organizationSlug,
                activity: activity.data.id,
            }),
        );
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
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

Edit.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Edit Activity" />
    </Layout>
);

export default Edit;
