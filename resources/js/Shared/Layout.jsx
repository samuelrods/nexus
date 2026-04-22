import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Alert from "./Alert";
import { cn } from "@/lib/utils";

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-background">
            <Alert />
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar sidebarOpen={sidebarOpen} />
            <main
                id="content"
                className={cn(
                    "pt-20 px-4 pb-8 transition-all duration-300 min-h-screen",
                    sidebarOpen ? "sm:ml-64" : "sm:ml-20"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
