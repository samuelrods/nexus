import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import { useForm, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Loader2, ArrowLeft, Save, User } from "lucide-react";

const Edit = ({ member, roles }) => {
    const memberData = member?.data ?? member;
    const { data, setData, put, processing, errors } = useForm({
        role_id: memberData?.role_id,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("members.update", memberData?.id));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-300">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{memberData?.full_name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{memberData?.email}</p>
                    </div>
                </div>
                <Button variant="ghost" asChild>
                    <Link href={route("members.index")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-4">
                    <Label className="text-lg font-semibold block mb-4">Assign Role</Label>
                    <div className="grid grid-cols-1 gap-3">
                        {roles.data.map((role) => (
                            <div 
                                key={role.id} 
                                className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${data.role_id === role.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                                onClick={() => setData('role_id', role.id)}
                            >
                                <input
                                    checked={data.role_id === role.id}
                                    onChange={() => setData('role_id', role.id)}
                                    name="role"
                                    type="radio"
                                    id={role.id}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <Label htmlFor={role.id} className="cursor-pointer font-medium text-gray-900 dark:text-white flex-1">
                                    {role.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <InputError message={errors.role_id} />
                </div>

                <div className="flex justify-end pt-6">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
                    >
                        {processing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {processing ? "Saving..." : "Update Member"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

Edit.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Edit Member" />
    </Layout>
);

export default Edit;
