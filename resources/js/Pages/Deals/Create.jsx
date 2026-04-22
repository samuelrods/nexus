import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import DealForm from "./Form";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        value: "",
        currency: "USD",
        close_date: null,
        status: "pending",
        description: "",
        lead_id: null,
        company_id: null,
        contact_id: null,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("deals.store"));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">


            <DealForm                data={data}
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
        <ResourceLayout children={page} title="Create Deal" />
    </Layout>
);

export default Create;
