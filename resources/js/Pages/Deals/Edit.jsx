import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import DealForm from "./Form";

const Edit = ({ deal }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: deal.data.name,
        value: deal.data.value,
        currency: deal.data.currency,
        close_date: deal.data.close_date,
        status: deal.data.status,
        description: deal.data.description,
        lead_id: deal.data.lead_id,
        lead_description: deal.data.lead_description,
        company_id: deal.data.company_id,
        company_name: deal.data.company_name,
        contact_id: deal.data.contact_id,
        contact_fullname: deal.data.contact_fullname,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("deals.update", deal.data.id));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <DealForm
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
        <ResourceLayout children={page} title="Edit Deal" />
    </Layout>
);

export default Edit;
