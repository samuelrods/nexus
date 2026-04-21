import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";

const TablePagination = ({ pagination }) => {
    return (
        <div className="flex justify-end overflow-x-auto py-5">
            <div className="inline-flex mt-2 xs:mt-0 gap-2 mx-1">
                <Button
                    variant="outline"
                    className={!pagination.prev ? "pointer-events-none opacity-50" : ""}
                    asChild
                >
                    <Link
                        href={pagination.prev ?? "#"}
                        preserveScroll
                        preserveState
                    >
                        Prev
                    </Link>
                </Button>
                <Button
                    variant="outline"
                    className={!pagination.next ? "pointer-events-none opacity-50" : ""}
                    asChild
                >
                    <Link
                        href={pagination.next ?? "#"}
                        preserveScroll
                        preserveState
                    >
                        Next
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default TablePagination;
