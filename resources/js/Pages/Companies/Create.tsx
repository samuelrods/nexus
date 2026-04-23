import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import CompanyForm from "./Form";

const Create = () => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;
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
        post(route("companies.store", { organization: organizationSlug }));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">


            <CompanyForm                data={data}
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
        <ResourceLayout children={page} title="Create Company" />
    </Layout>
);

export default Create;
