import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import InputError from "@/Components/InputError";
import { Loader2, ShieldCheck, ShieldAlert, CheckSquare, Square } from "lucide-react";
import capitalizeFirstLetter from "@/Shared/utils/capitalizeFirstLetter";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";

const PermissionsSection = ({ permissionsData, data, setData }) => {
    const toggleCategory = (categoryPermissions, checked) => {
        const permissionValues = categoryPermissions.map(p => p.value);
        const otherPermissions = data.permissions.filter(p => !permissionValues.includes(p));
        
        const newPermissions = checked 
            ? [...otherPermissions, ...permissionValues]
            : otherPermissions;
        
        setData("permissions", newPermissions);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            {Object.keys(permissionsData).map((key) => {
                const categoryPermissions = Object.values(permissionsData[key]);
                const allSelected = categoryPermissions.every(p => data.permissions.includes(p.value));

                return (
                    <Card key={key} className="overflow-hidden border-border bg-card/50 shadow-sm">
                        <CardHeader className="bg-muted/30 py-3 px-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground capitalize">
                                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                                    {capitalizeFirstLetter(key)}
                                </CardTitle>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 text-[10px] uppercase tracking-wider font-semibold hover:bg-muted"
                                    onClick={() => toggleCategory(categoryPermissions, !allSelected)}
                                >
                                    {allSelected ? (
                                        <><Square className="w-3 h-3 mr-1" /> Deselect All</>
                                    ) : (
                                        <><CheckSquare className="w-3 h-3 mr-1" /> Select All</>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-1">
                                {categoryPermissions.map((permission) => {
                                    const isChecked = data.permissions.includes(permission.value);
                                    return (
                                        <div 
                                            key={permission.value} 
                                            className="flex items-center rounded-md hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="flex items-center px-3 py-2 w-full cursor-pointer">
                                                <Checkbox
                                                    id={`perm-${permission.value}`}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setData("permissions", [...data.permissions, permission.value]);
                                                        } else {
                                                            setData("permissions", data.permissions.filter(p => p !== permission.value));
                                                        }
                                                    }}
                                                    className="mr-3"
                                                />
                                                <Label
                                                    htmlFor={`perm-${permission.value}`}
                                                    className="text-sm font-medium leading-none cursor-pointer flex-grow py-1"
                                                >
                                                    {permission.label}
                                                </Label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
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
            className="space-y-8 w-full max-w-4xl mx-auto"
        >
            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full">
                        <Label htmlFor="name" className="mb-2 block">Role Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Sales Manager, Support Specialist"
                            value={data.name || ""}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            autoComplete="off"
                            className="bg-card"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                </CardContent>
            </Card>

            <div className="w-full">
                <div className="flex items-center gap-3 mb-2 px-1">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-foreground">Role Permissions</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6 px-1">
                    Configure exactly what members with this role can see and do in the system.
                </p>
                <PermissionsSection permissionsData={permissionsData} data={data} setData={setData} />
                <InputError message={errors.permissions} className="mt-4 text-center" />
            </div>

            <div className="w-full flex justify-end pt-6 border-t">
                <Button
                    type="submit"
                    disabled={processing ?? false}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 min-w-[200px] shadow-md shadow-blue-500/20"
                >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? "Saving..." : updating ? "Update Role Configuration" : "Create New Role"}
                </Button>
            </div>
        </form>
    );
};

export default RoleForm;
