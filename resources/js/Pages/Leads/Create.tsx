import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import LeadForm from "./Form";

const Create = () => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const { data, setData, post, processing, errors } = useForm({
        company_id: null,
        contact_id: null,
        source: "",
        status: "open",
        description: "",
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        post(route("leads.store", { organization: organizationSlug }));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <LeadForm
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
        <ResourceLayout children={page} title="Create Lead" />
    </Layout>
);

export default Create;
