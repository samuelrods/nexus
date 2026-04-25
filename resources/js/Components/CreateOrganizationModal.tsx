import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Plus } from "lucide-react";

const CreateOrganizationModal = ({ trigger }: any) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [processing, setProcessing] = useState(false);

    const onSubmit = (e: any) => {
        e.preventDefault();
        setProcessing(true);
        router.post(
            route("organizations.store"),
            { name },
            {
                onFinish: () => {
                    setProcessing(false);
                    setOpen(false);
                    setName("");
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 group">
                        <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                        Create Organization
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        New Organization
                    </DialogTitle>
                    <DialogDescription>
                        Create a new workspace for your team and deals.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Organization Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g. Acme Corp"
                            autoComplete="off"
                            value={name}
                            onChange={(e: any) => setName(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                            disabled={processing || !name.trim()}
                        >
                            {processing ? "Creating..." : "Create Organization"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOrganizationModal;
