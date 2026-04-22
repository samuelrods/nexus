import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm } from "@inertiajs/react";
import ContactForm from "./Form";

const Edit = ({ contact }) => {
    const { data, setData, put, processing, errors } = useForm({
        first_name: contact.data.first_name || "",
        last_name: contact.data.last_name || "",
        email: contact.data.email || "",
        phone_number: contact.data.phone_number || "",
        organization_name: contact.data.organization_name || "",
        job_title: contact.data.job_title || "",
        description: contact.data.description || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("contacts.update", contact.data.id));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
            <ContactForm
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
        <ResourceLayout children={page} title="Edit Contact" />
    </Layout>
);

export default Edit;
