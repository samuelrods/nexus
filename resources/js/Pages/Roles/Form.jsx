import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import InputError from "@/Components/InputError";
import { Loader2 } from "lucide-react";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";

const PermissionsSection = ({ permissionsData, data, setData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
            {Object.keys(permissionsData).map((key) => (
                <div key={key} className="space-y-3 p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 border-b pb-2 mb-4">
                        {capitalizeFirstLetter(key)}
                    </h3>
                    <div className="space-y-2">
                        {Object.values(permissionsData[key]).map((permission) => (
                            <div key={permission.value} className="flex items-center space-x-3">
                                <Checkbox
                                    id={permission.value}
                                    checked={data.permissions.includes(permission.value)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData(
                                                "permissions",
                                                [...data.permissions, permission.value],
                                            );
                                        } else {
                                            setData(
                                                "permissions",
                                                data.permissions.filter(
                                                    (p) => p !== permission.value,
                                                ),
                                            );
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor={permission.value}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {permission.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const RoleForm = ({
    data,
    setData,
    errors,
    onSubmit,
    processing,
    permissionsData,
    updating = false,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-8 flex flex-col items-center max-w-4xl mx-auto"
        >
            <div className="w-full">
                <Label htmlFor="name" className="mb-2 block">Role Name</Label>
                <Input
                    id="name"
                    placeholder="Enter role name"
                    value={data.name || ""}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoComplete="off"
                    className="bg-white dark:bg-gray-800"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="w-full">
                <Label className="text-xl font-bold mb-4 block text-center">Permissions</Label>
                <PermissionsSection permissionsData={permissionsData} data={data} setData={setData} />
                <InputError message={errors.permissions} className="mt-2 text-center" />
            </div>

            <div className="w-full flex justify-center pt-4">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? "Saving..." : updating ? "Update Role" : "Add Role"}
                </Button>
            </div>
        </form>
    );
};

export default RoleForm;
