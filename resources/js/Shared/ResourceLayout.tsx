import { Head, Link, usePage } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";

const ResourceLayout = ({
    children,
    title,
    description,
    hideHeader = false,
}: any) => {
    const { url, props } = usePage();
    const organization = props.auth.organization;

    // Split by '/', then filter and map
    let pathParts = url
        .split("/")
        .filter((part: any) => part)
        .map((part: any) => part.split("?")[0]);

    // If the first part is the organization slug, remove it from breadcrumbs
    if (organization && pathParts[0] === organization.slug) {
        pathParts = pathParts.slice(1);
    }

    return (
        <>
            <Head title={title} />
            <div className="mb-8">
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link
                                href={
                                    organization
                                        ? `/${organization.slug}/dashboard`
                                        : "/dashboard"
                                }
                                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-white"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Dashboard
                            </Link>
                        </li>
                        {pathParts.map((part: any, index: any) => (
                            <li key={index}>
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    <span className="ml-1 text-sm font-medium text-muted-foreground capitalize md:ml-2">
                                        {part.replace(/-/g, " ")}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
                {!hideHeader && (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-6">{children}</div>
        </>
    );
};

export default ResourceLayout;
