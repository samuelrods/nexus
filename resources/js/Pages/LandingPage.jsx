import { Head, Link, usePage } from "@inertiajs/react";
import Alert from "@/Shared/Alert";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Check, Menu, X, Rocket, Users, Target, Shield, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function NavbarLP() {
    const { user } = usePage().props.auth;
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: "#home", label: "Home" },
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
        { href: "#faq", label: "F.A.Q" },
    ];

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3">
                    <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white text-blue-600">
                        Nexus
                    </span>
                </Link>
                
                <div className="flex md:order-2 space-x-3 items-center">
                    {user ? (
                        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400">Log in</Link>
                            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                                <Link href="/register">Get started</Link>
                            </Button>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <div className={cn(
                    "items-center justify-between w-full md:flex md:w-auto md:order-1",
                    !isOpen && "hidden"
                )}>
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

function HeroSection() {
    const { user } = usePage().props.auth;

    return (
        <section id="home" className="bg-white dark:bg-gray-900 pt-16 pb-24">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-7xl dark:text-white">
                    Streamline Your Business with <span className="text-blue-600">Powerful CRM</span>
                </h1>
                <p className="mb-10 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
                    Organize your contacts, manage deals, and boost your
                    team collaboration with the most intuitive CRM on the market.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {user ? (
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto" asChild>
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto" asChild>
                            <Link href="/register">Get started for free</Link>
                        </Button>
                    )}
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 mt-12 relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-full scale-90"></div>
                <img
                    src="/images/dashboard_screen.png"
                    className="w-full shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800"
                    alt="CRM Dashboard Preview"
                />
            </div>
        </section>
    );
}

function FeaturesSection() {
    const features = [
        {
            title: "Organize your world",
            desc: "Create and manage organizations, invite team members, and assign roles with predefined permissions.",
            icon: Users
        },
        {
            title: "Centralized management",
            desc: "Create, view, update, and delete contacts, keeping all your customer information organized in one place.",
            icon: Target
        },
        {
            title: "Sales pipeline",
            desc: "Manage companies, leads, deals, and activities, gaining a clear overview of your sales process.",
            icon: Rocket
        }
    ];

    return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-16">
                    Unleash the Power of CRM's Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col items-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                <f.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {f.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingSection() {
    const benefits = [
        "5 team members",
        "20GB Cloud storage",
        "Integration help",
        "Complete documentation",
        "24×7 phone & email support"
    ];

    return (
        <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
            <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center">Simple Pricing</h2>
                <Card className="max-w-sm w-full shadow-xl border-blue-100 dark:border-blue-900/30 overflow-hidden">
                    <CardHeader className="bg-blue-600 text-white text-center py-8">
                        <CardTitle className="text-xl font-medium mb-4 opacity-90">Free plan</CardTitle>
                        <div className="flex items-baseline justify-center">
                            <span className="text-3xl font-semibold">$</span>
                            <span className="text-6xl font-extrabold tracking-tight">0</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ul className="space-y-4 mb-8">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">{b}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 h-auto text-lg" asChild>
                            <Link href="/register">Choose plan</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function FaqSection() {
    const faqs = [
        {
            q: "What is CRM and why do I need it?",
            a: "CRM, or customer relationship management, is a system that helps businesses manage interactions with current and potential customers. it boosts efficiency, enhances customer satisfaction, and drives growth."
        },
        {
            q: "How can CRM benefit my business?",
            a: "CRM centralizes customer data, streamlines communication, and automates tasks. it improves customer service, increases sales, and provides valuable insights for better decision-making."
        },
        {
            q: "Is CRM suitable for small businesses?",
            a: "Absolutely! crm systems come in various sizes and functionalities, making them adaptable to businesses of all scales. small businesses can benefit by organizing customer information, streamlining processes, and fostering stronger relationships."
        },
        {
            q: "What features should I look for in a CRM?",
            a: "Look for features like contact management, lead tracking, email integration, and analytics. customization options, scalability, and ease of use are also crucial."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Everything you need to know about getting started and making the most of your CRM.
                    </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full bg-white dark:bg-gray-900 rounded-2xl border p-2">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 px-4">
                            <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors py-6">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

function FooterSection() {
    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-12">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold dark:text-white text-blue-600">
                            Nexus
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 smlrods™. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">About</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Licensing</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Head title="Welcome" />
            <NavbarLP />
            <main>
                <HeroSection />
                <FeaturesSection />
                <PricingSection />
                <FaqSection />
            </main>
            <FooterSection />
            <Alert />
        </div>
    );
};

export default LandingPage;
