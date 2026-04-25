import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import ContactForm from "./Form";

const Edit = ({ contact, companies }: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;
    const { data, setData, put, processing, errors } = useForm({
        first_name: contact.data.first_name || "",
        last_name: contact.data.last_name || "",
        email: contact.data.email || "",
        phone_number: contact.data.phone_number || "",
        job_title: contact.data.job_title || "",
        company_id: contact.data.company_id || null,
        organization_name: contact.data.organization_name || "",
        description: contact.data.description || "",
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        put(
            route("contacts.update", {
                organization: organizationSlug,
                contact: contact.data.id,
            }),
        );
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

Edit.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Edit Contact" />
    </Layout>
);

export default Edit;
