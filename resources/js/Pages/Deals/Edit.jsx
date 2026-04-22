import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
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
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Deal: {deal.data.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Update the deal details below.</p>
            </div>

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
        <ResouceLayout children={page} title="Edit Deal" />
    </Layout>
);

export default Edit;
