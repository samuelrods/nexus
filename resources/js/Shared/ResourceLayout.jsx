import { Head, Link, usePage } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";

const ResouceLayout = ({ children, title }) => {
    const { url } = usePage();
    // Split by '/', then take the first part of any part that contains '?' to remove query strings
    const pathParts = url.split('/')
        .filter(part => part)
        .map(part => part.split('?')[0]);
    
    return (
        <>
            <Head title={title} />
            <div className="mb-8">
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <Home className="w-4 h-4 mr-2" />
                                Dashboard
                            </Link>
                        </li>
                        {pathParts.map((part, index) => (
                            <li key={index}>
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                    <span className="ml-1 text-sm font-medium text-gray-700 capitalize md:ml-2 dark:text-gray-400">
                                        {part.replace(/-/g, ' ')}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                </nav>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Manage your {title.toLowerCase()} and view their details.
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </>
    );
};

export default ResouceLayout;
