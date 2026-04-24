import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import CompanyForm from "./Form";

const Edit = ({ company }) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;
    const { data, setData, put, processing, errors } = useForm({
        name: company.data.name || "",
        website: company.data.website || "",
        industry: company.data.industry || "",
        description: company.data.description || "",
        street_address: company.data.street_address || "",
        city: company.data.city || "",
        state: company.data.state || "",
        zip_code: company.data.zip_code || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("companies.update", { organization: organizationSlug, company: company.data.id }));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <CompanyForm
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
        <ResourceLayout children={page} title="Edit Company" />
    </Layout>
);

export default Edit;
