import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ShieldCheck, Users, Contact, Building2, Target, Handshake, CalendarDays } from 'lucide-react';
import { cn } from "@/lib/utils";

const SidebarItem = ({ href, icon: Icon, children, collapsed }) => {
    const { url } = usePage();
    const active = url.startsWith(href);

    return (
        <li>
            <Link
                href={href}
                className={cn(
                    "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors",
                    active && "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                )}
            >
                <Icon className={cn(
                    "w-5 h-5 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white",
                    active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                )} />
                {!collapsed && <span className="ms-3 font-medium">{children}</span>}
            </Link>
        </li>
    );
};

const Sidebar = ({ sidebarOpen }) => {
    const [collapsed, setCollapsed] = useState(sidebarOpen);

    useEffect(() => {
        setCollapsed(sidebarOpen);
    }, [sidebarOpen]);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-30 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700",
                collapsed ? "w-20" : "w-64"
            )}
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <SidebarItem href="/dashboard" icon={LayoutDashboard} collapsed={collapsed}>
                        Dashboard
                    </SidebarItem>
                    <SidebarItem href="/roles" icon={ShieldCheck} collapsed={collapsed}>
                        Roles
                    </SidebarItem>
                    <SidebarItem href="/members" icon={Users} collapsed={collapsed}>
                        Members
                    </SidebarItem>
                    <SidebarItem href="/contacts" icon={Contact} collapsed={collapsed}>
                        Contacts
                    </SidebarItem>
                    <SidebarItem href="/companies" icon={Building2} collapsed={collapsed}>
                        Companies
                    </SidebarItem>
                    <SidebarItem href="/leads" icon={Target} collapsed={collapsed}>
                        Leads
                    </SidebarItem>
                    <SidebarItem href="/deals" icon={Handshake} collapsed={collapsed}>
                        Deals
                    </SidebarItem>
                    <SidebarItem href="/activities" icon={CalendarDays} collapsed={collapsed}>
                        Activities
                    </SidebarItem>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
