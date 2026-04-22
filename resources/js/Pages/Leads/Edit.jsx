import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import LeadForm from "./Form";

const Edit = ({ lead }) => {
    const { data, setData, put, processing, errors } = useForm({
        company_id: lead.data.company_id,
        company_name: lead.data.company_name,
        contact_id: lead.data.contact_id,
        contact_fullname: lead.data.contact_fullname,
        source: lead.data.source,
        status: lead.data.status,
        description: lead.data.description,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("leads.update", lead.data.id));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <LeadForm
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
        <ResouceLayout children={page} title="Edit Lead" />
    </Layout>
);

export default Edit;
