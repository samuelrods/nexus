import Layout from "@/Shared/Layout";
import ResouceLayout from "@/Shared/ResourceLayout";
import Table from "@/Shared/Table";
import TableActions from "@/Shared/TableActions";
import TablePagination from "@/Shared/TablePagination";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Loader2 } from "lucide-react";

const AddMemberForm = ({ data, setData, errors, onSubmit, processing }) => {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 flex flex-col items-center"
        >
            <div className="w-full">
                <Input
                    id="member-info"
                    placeholder="Username or Email"
                    value={data.memberInfo}
                    onChange={(e) => setData("memberInfo", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-white dark:bg-gray-800"
                />
                <InputError message={errors.memberInfo} className="mt-2" />
            </div>
            <div>
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? "Sending..." : "Send Invitation"}
                </Button>
            </div>
        </form>
    );
};

const EditMemberForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    formData,
    item,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 flex flex-col items-center"
        >
            <div className="w-full text-center">
                <h1 className="text-xl font-bold">{item.full_name}</h1>
            </div>
            <div className="space-y-2 w-full max-w-xs mx-auto">
                <Label className="text-sm font-semibold mb-2 block">Select Role</Label>
                {formData.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
                        <input
                            checked={data.role_id === role.id}
                            onChange={() => setData('role_id', role.id)}
                            name="role"
                            type="radio"
                            id={role.id}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor={role.id} className="cursor-pointer font-normal">{role.name}</Label>
                    </div>
                ))}
                <InputError message={errors.role_id} className="mt-2" />
            </div>
            <div>
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};

const Members = ({ pagination, rolesData }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <TableActions
                searchRoute={"members.index"}
                resourceType={"Members"}
                storeRoute={"invitations.store"}
                ResourceForm={AddMemberForm}
                resourceInfo={[["memberInfo", ""]]}
            />
            <Table
                data={pagination.data}
                columns={[
                    { header: "Name", key: "full_name" },
                    { header: "Email", key: "email" },
                    { header: "Role", key: "role_name" },
                ]}
                resourceName={"members"}
                propertyIdPath={"membership.id"}
                EditResourceForm={EditMemberForm}
                editFormData={rolesData.data}
                resourceInfoKeys={["role_id"]}
            />
            <TablePagination pagination={pagination.links} />
        </div>
    );
};

Members.layout = (page) => (
    <Layout>
        <ResouceLayout children={page} title="Members" />
    </Layout>
);

export default Members;
