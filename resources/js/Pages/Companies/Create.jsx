import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import CompanyForm from "./Form";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        website: "",
        industry: "",
        description: "",
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("companies.store"));
    };

    return (
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-lg shadow-sm border border-border">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-foreground">Create New Company</h2>
                <p className="text-muted-foreground">Fill in the information below to add a new company to your organization.</p>
            </div>
            
            <CompanyForm
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
        <ResouceLayout children={page} title="Create Company" />
    </Layout>
);

export default Create;
