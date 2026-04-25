import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    ShieldCheck,
    Users,
    Contact,
    Building2,
    Target,
    Handshake,
    CalendarDays,
    ChevronDown,
    ChevronRight,
    Briefcase,
    Settings,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItem = ({ href, icon: Icon, children, collapsed, isSubItem }) => {
    const { url } = usePage();
    const active = url.startsWith(href);
    const testId = `sidebar-item-${String(children)
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

    return (
        <li>
            <Link
                href={href}
                data-testid={testId}
                className={cn(
                    "flex items-center p-2 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground group transition-colors",
                    active && "bg-accent text-accent-foreground",
                    isSubItem && !collapsed && "pl-11",
                    collapsed && "justify-center",
                )}
            >
                {Icon && (
                    <Icon
                        className={cn(
                            "w-5 h-5 transition duration-75 group-hover:text-foreground",
                            active
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-muted-foreground",
                        )}
                    />
                )}
                {!collapsed && (
                    <span className={cn("font-medium", Icon ? "ms-3" : "")}>
                        {children}
                    </span>
                )}
            </Link>
        </li>
    );
};

const SidebarGroup = ({
    title,
    icon: Icon,
    children,
    collapsed,
    activePaths = [],
}) => {
    const { url } = usePage();
    const isActive = activePaths.some((path) => url.startsWith(path));
    const [isOpen, setIsOpen] = useState(isActive);
    const testId = `sidebar-group-${title.toLowerCase().replace(/\s+/g, "-")}`;

    useEffect(() => {
        if (isActive && !collapsed) {
            setIsOpen(true);
        }
    }, [isActive, collapsed]);

    const handleToggle = () => {
        if (collapsed && activePaths.length > 0) {
            router.visit(activePaths[0]);
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <li>
            <button
                type="button"
                onClick={handleToggle}
                data-testid={testId}
                className={cn(
                    "flex items-center w-full p-2 text-base text-foreground transition duration-75 rounded-lg group hover:bg-accent hover:text-accent-foreground",
                    isActive && !isOpen && "bg-accent text-accent-foreground",
                    collapsed && "justify-center",
                )}
                title={collapsed ? title : undefined}
            >
                <Icon
                    className={cn(
                        "w-5 h-5 transition duration-75 group-hover:text-foreground",
                        isActive && !isOpen
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-muted-foreground",
                    )}
                />
                {!collapsed && (
                    <>
                        <span className="flex-1 ms-3 text-left whitespace-nowrap font-medium">
                            {title}
                        </span>
                        {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                    </>
                )}
            </button>
            <ul
                className={cn(
                    "py-2 space-y-2",
                    isOpen && !collapsed ? "block" : "hidden",
                )}
            >
                {children}
            </ul>
        </li>
    );
};

const Sidebar = ({ sidebarOpen }) => {
    const [collapsed, setCollapsed] = useState(!sidebarOpen);
    const { auth } = usePage().props;
    const organization = auth.organization;
    const prefix = organization ? `/${organization.slug}` : "";

    const userPermissions = auth.user?.permissions || [];
    const userRoles = auth.user?.roles || [];
    const hasPermission = (permission) =>
        userRoles.includes("owner") || userPermissions.includes(permission);

    const canViewContacts = hasPermission("read-contacts");
    const canViewCompanies = hasPermission("read-companies");
    const showCrmGroup = canViewContacts || canViewCompanies;

    const canViewLeads = hasPermission("read-leads");
    const canViewDeals = hasPermission("read-deals");
    const canViewActivities = hasPermission("read-activities");
    const showSalesGroup = canViewLeads || canViewDeals || canViewActivities;

    const canViewOrganizations =
        hasPermission("read-organizations") ||
        hasPermission("update-organizations");
    const canViewMembers = hasPermission("read-members");
    const canViewRoles = hasPermission("read-roles");
    const showSettingsGroup =
        canViewOrganizations || canViewMembers || canViewRoles;

    useEffect(() => {
        setCollapsed(!sidebarOpen);
    }, [sidebarOpen]);

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] transition-transform bg-card border-r border-border",
                collapsed ? "w-20" : "w-64",
            )}
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-4 overflow-y-auto bg-card">
                <ul className="space-y-2 font-medium">
                    <SidebarItem
                        href={`${prefix}/dashboard`}
                        icon={LayoutDashboard}
                        collapsed={collapsed}
                    >
                        Dashboard
                    </SidebarItem>

                    {showCrmGroup && (
                        <SidebarGroup
                            title="CRM"
                            icon={Briefcase}
                            collapsed={collapsed}
                            activePaths={[
                                `${prefix}/contacts`,
                                `${prefix}/companies`,
                            ]}
                        >
                            {canViewContacts && (
                                <SidebarItem
                                    href={`${prefix}/contacts`}
                                    icon={Contact}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Contacts
                                </SidebarItem>
                            )}
                            {canViewCompanies && (
                                <SidebarItem
                                    href={`${prefix}/companies`}
                                    icon={Building2}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Companies
                                </SidebarItem>
                            )}
                        </SidebarGroup>
                    )}

                    {showSalesGroup && (
                        <SidebarGroup
                            title="Sales"
                            icon={TrendingUp}
                            collapsed={collapsed}
                            activePaths={[
                                `${prefix}/leads`,
                                `${prefix}/deals`,
                                `${prefix}/activities`,
                            ]}
                        >
                            {canViewLeads && (
                                <SidebarItem
                                    href={`${prefix}/leads`}
                                    icon={Target}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Leads
                                </SidebarItem>
                            )}
                            {canViewDeals && (
                                <SidebarItem
                                    href={`${prefix}/deals`}
                                    icon={Handshake}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Deals
                                </SidebarItem>
                            )}
                            {canViewActivities && (
                                <SidebarItem
                                    href={`${prefix}/activities`}
                                    icon={CalendarDays}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Activities
                                </SidebarItem>
                            )}
                        </SidebarGroup>
                    )}

                    {showSettingsGroup && (
                        <SidebarGroup
                            title="Settings"
                            icon={Settings}
                            collapsed={collapsed}
                            activePaths={[
                                `${prefix}/roles`,
                                `${prefix}/members`,
                                `${prefix}/organizations/settings`,
                            ]}
                        >
                            {canViewOrganizations && (
                                <SidebarItem
                                    href={`${prefix}/organizations/settings`}
                                    icon={Building2}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Organization
                                </SidebarItem>
                            )}
                            {canViewMembers && (
                                <SidebarItem
                                    href={`${prefix}/members`}
                                    icon={Users}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Members
                                </SidebarItem>
                            )}
                            {canViewRoles && (
                                <SidebarItem
                                    href={`${prefix}/roles`}
                                    icon={ShieldCheck}
                                    collapsed={collapsed}
                                    isSubItem
                                >
                                    Roles
                                </SidebarItem>
                            )}
                        </SidebarGroup>
                    )}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
