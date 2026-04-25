import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import DealForm from "./Form";

const Edit = ({ deal }: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;

    const { data, setData, put, processing, errors } = useForm({
        name: deal.data.name,
        value: deal.data.value,
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

    const onSubmit = (e: any) => {
        e.preventDefault();
        put(
            route("deals.update", {
                organization: organizationSlug,
                deal: deal.data.id,
            }),
        );
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

Edit.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Edit Deal" />
    </Layout>
);

export default Edit;
