import Layout from "@/Shared/Layout";
import ResourceLayout from "@/Shared/ResourceLayout";
import { useForm, usePage } from "@inertiajs/react";
import ContactForm from "./Form";

const Create = ({ companies }: any) => {
    const { auth } = usePage().props;
    const organizationSlug = auth.organization?.slug;
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        job_title: "",
        company_id: null,
        organization_name: "",
        description: "",
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        post(route("contacts.store", { organization: organizationSlug }));
    };

    return (
        <div className="max-w-4xl bg-card p-8 rounded-lg shadow-sm border border-border">
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

Create.layout = (page: any) => (
    <Layout>
        <ResourceLayout children={page} title="Create Contact" />
    </Layout>
);

export default Create;
