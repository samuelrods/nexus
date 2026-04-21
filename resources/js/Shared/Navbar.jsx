import { Link, router, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Menu, UserCircle, LogOut, LayoutDashboard, Building } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
    const { auth } = usePage().props;

    const handleOrganizationSelection = (organizationId) => {
        router.put(route("users.organization"), {
            organization_id: organizationId,
        });
    };

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-16 flex items-center px-4">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/dashboard" className="flex items-center">
                        <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white text-blue-600">
                            Nexus CRM
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {/* Organization Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                                <Building className="h-4 w-4" />
                                <span>
                                    {auth.organization.name.length > 15
                                        ? auth.organization.name.substring(0, 15) + "..."
                                        : auth.organization.name}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {auth.user.memberships.map((membership) => (
                                <DropdownMenuItem
                                    key={"navbar-" + membership.organization.id}
                                    onClick={() => handleOrganizationSelection(membership.organization.id)}
                                    className="cursor-pointer"
                                >
                                    {membership.organization.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <UserCircle className="h-8 w-8 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{auth.user.full_name}</span>
                                    <span className="text-xs text-gray-500 truncate">{auth.user.email}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="cursor-pointer flex items-center">
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => router.post("/logout")}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
