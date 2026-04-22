import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import CompanyForm from "./Form";

const Edit = ({ company }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: company.data.name || "",
        website: company.data.website || "",
        industry: company.data.industry || "",
        description: company.data.description || "",
        street_address: company.data.address.street_address || "",
        city: company.data.address.city || "",
        state: company.data.address.state || "",
        zip_code: company.data.address.zip_code || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("companies.update", company.data.id));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Company: {company.data.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">Update the company details below.</p>
            </div>

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
        <ResouceLayout children={page} title="Edit Company" />
    </Layout>
);

export default Edit;
