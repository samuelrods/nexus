import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Alert from "./Alert";
import { cn } from "@/lib/utils";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { auth } = usePage().props;

    // Update Ziggy defaults during render to keep it in sync with auth.organization
    if (auth.organization && typeof window !== "undefined" && window.Ziggy) {
        window.Ziggy.defaults = {
            organization: auth.organization.slug,
        };
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            <Alert />
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 overflow-hidden pt-16">
                <Sidebar sidebarOpen={sidebarOpen} />
                <main
                    id="content"
                    className={cn(
                        "flex-1 overflow-y-auto px-4 py-8 transition-all duration-300",
                        sidebarOpen ? "sm:ml-64" : "sm:ml-20",
                    )}
                >
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
