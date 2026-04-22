import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import ContactForm from "./Form";

const Create = () => {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        organization_name: "",
        job_title: "",
        description: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("contacts.store"));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Contact</h2>
                <p className="text-gray-500 dark:text-gray-400">Fill in the information below to add a new contact to your network.</p>
            </div>
            
            <ContactForm
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
        <ResouceLayout children={page} title="Create Contact" />
    </Layout>
);

export default Create;
