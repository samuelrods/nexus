import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
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
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-sm border border-border">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-foreground">Create New Deal</h2>
                <p className="text-muted-foreground">Add a new business deal to your pipeline.</p>
            </div>
            
            <DealForm
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
        <ResouceLayout children={page} title="Create Deal" />
    </Layout>
);

export default Create;
