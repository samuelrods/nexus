import { usePage } from "@inertiajs/react";
import {
    Alert as AlertUI,
    AlertDescription,
    AlertTitle,
} from "@/Components/ui/alert";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const Alert = () => {
    const { flash } = usePage().props;
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash.alert && flash.alert.message) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [flash]);

    if (!showAlert) return null;

    const variant =
        flash.alert.type === "failure" || flash.alert.type === "error"
            ? "destructive"
            : "default";

    return (
        <div className="fixed top-0 left-0 flex justify-center w-full pointer-events-none p-5 z-[100]">
            <AlertUI
                variant={variant}
                className="pointer-events-auto max-w-md bg-card shadow-lg border-2"
            >
                <div className="flex justify-between items-start w-full">
                    <div className="flex-1">
                        <AlertTitle className="capitalize">
                            {flash.alert.type ?? "Success"}
                        </AlertTitle>
                        <AlertDescription>
                            {flash.alert.message}
                        </AlertDescription>
                    </div>
                    <button
                        onClick={() => setShowAlert(false)}
                        className="ml-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </AlertUI>
        </div>
    );
};

export default Alert;
