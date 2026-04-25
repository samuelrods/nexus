import { Head, Link, usePage } from "@inertiajs/react";
import { ModeToggle } from "@/Components/ModeToggle";
import Alert from "@/Shared/Alert";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import {
    Check,
    Menu,
    X,
    Users,
    Target,
    Shield,
    Building2,
    UserPlus,
    BarChart3,
    Search,
    Calendar,
    ArrowRight,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/* ─── Animated floating orb for the hero ─── */
function FloatingOrb({ className, delay = 0 }) {
    return (
        <div
            className={cn(
                "absolute rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none",
                className,
            )}
            style={{ animationDelay: `${delay}s`, animationDuration: "4s" }}
        />
    );
}

/* ─── Navbar ─── */
function NavbarLP() {
    const { user } = usePage().props.auth;
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = [
        { href: "#home", label: "Home" },
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
        { href: "#faq", label: "F.A.Q" },
    ];

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-sm"
                    : "bg-transparent border-b border-transparent",
            )}
        >
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                        Nexus
                    </span>
                </Link>

                <div className="flex md:order-2 space-x-3 items-center">
                    <ModeToggle />
                    {user ? (
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                            asChild
                        >
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Log in
                            </Link>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                asChild
                            >
                                <Link href="/register">Get started</Link>
                            </Button>
                        </div>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-muted-foreground rounded-lg md:hidden hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                <div
                    className={cn(
                        "items-center justify-between w-full md:flex md:w-auto md:order-1",
                        !isOpen && "hidden",
                    )}
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-border rounded-lg bg-card/80 backdrop-blur-xl md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="block py-2 px-3 text-muted-foreground rounded hover:text-foreground transition-colors md:hover:bg-transparent md:p-0"
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

/* ─── Hero ─── */
function HeroSection() {
    const { user } = usePage().props.auth;

    return (
        <section id="home" className="relative overflow-hidden bg-background">
            {/* Floating gradient orbs */}
            <FloatingOrb
                className="w-96 h-96 bg-blue-500 -top-48 -left-48"
                delay={0}
            />
            <FloatingOrb
                className="w-80 h-80 bg-violet-500 top-1/3 -right-40"
                delay={1.5}
            />
            <FloatingOrb
                className="w-64 h-64 bg-cyan-500 bottom-0 left-1/3"
                delay={3}
            />

            <div className="relative py-24 px-4 mx-auto max-w-screen-xl lg:py-36">
                {/* Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Open-source CRM for modern teams
                    </div>
                </div>

                <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-[1.1] text-foreground md:text-6xl lg:text-7xl text-center max-w-4xl mx-auto">
                    Your entire sales
                    <br />
                    pipeline in{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                        one place
                    </span>
                </h1>

                <p className="mb-12 text-lg font-normal text-muted-foreground lg:text-xl text-center max-w-2xl mx-auto leading-relaxed">
                    Manage contacts, track deals, log activities, and
                    collaborate across organizations — all with role-based
                    permissions and real-time dashboards.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {user ? (
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto shadow-xl shadow-blue-600/20 group"
                            asChild
                        >
                            <Link href="/dashboard">
                                Go to Dashboard
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto shadow-xl shadow-blue-600/20 group"
                                asChild
                            >
                                <Link href="/register">
                                    Get started free
                                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-6 h-auto border-border hover:bg-accent group"
                                asChild
                            >
                                <a href="#features">
                                    See features
                                    <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </>
                    )}
                </div>

                {/* Stats bar */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    {[
                        { label: "Resources", value: "6+" },
                        { label: "Role Permissions", value: "Custom" },
                        { label: "Multi-org", value: "Built-in" },
                        { label: "Cost", value: "Free" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50"
                        >
                            <div className="text-2xl font-bold text-foreground">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Features – Bento Grid ─── */
function FeaturesSection() {
    const features = [
        {
            title: "Contact Management",
            desc: "Full contact records with organizational affiliations, quick search, and detailed profiles.",
            icon: Users,
            color: "blue",
        },
        {
            title: "Company Tracking",
            desc: "Track companies with addresses, industries, and relationships to contacts and deals.",
            icon: Building2,
            color: "violet",
        },
        {
            title: "Lead Pipeline",
            desc: "Capture leads from multiple sources and track their journey all the way to conversion.",
            icon: UserPlus,
            color: "emerald",
        },
        {
            title: "Deal Management",
            desc: "Manage deal values, statuses, and close dates with organization-wide currency settings.",
            icon: Target,
            color: "amber",
        },
        {
            title: "Activity Logging",
            desc: "Log calls, emails, and meetings tied to contacts and leads. Full audit trail included.",
            icon: Calendar,
            color: "rose",
        },
        {
            title: "Role-Based Access",
            desc: "Granular permissions with custom roles per organization. Control who can view, create, or manage resources.",
            icon: Shield,
            color: "cyan",
        },
        {
            title: "Executive Dashboards",
            desc: "Real-time stats, revenue charts, deal distributions, and activity breakdowns at a glance.",
            icon: BarChart3,
            color: "indigo",
        },
        {
            title: "Instant Search",
            desc: "Find any contact, lead, deal, or company in milliseconds with Meilisearch-powered search.",
            icon: Search,
            color: "teal",
        },
    ];

    const colorMap = {
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    };

    return (
        <section id="features" className="py-24 bg-accent/30">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                        Features
                    </div>
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Everything you need to close more deals
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From first contact to closed deal, Nexus gives your team
                        full visibility into every step of the sales process.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="group relative p-6 bg-card rounded-2xl border border-border transition-all duration-300 hover:shadow-lg hover:border-border/80 hover:-translate-y-0.5"
                        >
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                    colorMap[f.color],
                                )}
                            >
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                {f.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Pricing ─── */
function PricingSection() {
    const benefits = [
        "Unlimited contacts & companies",
        "Leads, deals & activity tracking",
        "Multi-organization support",
        "Custom roles & permissions",
        "Executive dashboards & charts",
        "Full-text search with Meilisearch",
    ];

    return (
        <section id="pricing" className="py-24 bg-background">
            <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                        Pricing
                    </div>
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Free. No strings attached.
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Nexus is open-source. Deploy it yourself and get every
                        feature at zero cost.
                    </p>
                </div>

                <Card className="max-w-md w-full shadow-xl border-border overflow-hidden bg-card relative">
                    {/* Decorative gradient stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500" />

                    <CardHeader className="text-center pt-10 pb-6">
                        <CardTitle className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
                            Self-hosted
                        </CardTitle>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                $0
                            </span>
                            <span className="text-muted-foreground font-medium">
                                / forever
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <ul className="space-y-4 mb-8">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-muted-foreground font-medium text-sm">
                                        {b}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 py-6 h-auto text-lg shadow-lg shadow-blue-600/20"
                            asChild
                        >
                            <Link href="/register">Start building</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

/* ─── FAQ ─── */
function FaqSection() {
    const faqs = [
        {
            q: "What is Nexus?",
            a: "Nexus is an open-source CRM built with Laravel, React, and Inertia.js. It helps teams manage contacts, companies, leads, deals, and activities — all within a multi-tenant architecture with role-based access control.",
        },
        {
            q: "Do I need to pay anything?",
            a: "No. Nexus is completely free and open-source under the MIT license. You host it on your own infrastructure and get every feature at zero cost.",
        },
        {
            q: "How does multi-organization support work?",
            a: "Users can create or join multiple organizations. Each organization has its own isolated data, custom roles, permissions, and currency settings. Switch between organizations seamlessly from the dashboard.",
        },
        {
            q: "What permissions can I configure?",
            a: "Nexus uses a granular role-based access control system. You can create custom roles per organization and assign specific permissions for viewing, creating, editing, or deleting contacts, companies, leads, deals, activities, and managing team members.",
        },
        {
            q: "What tech stack does Nexus use?",
            a: "The backend is powered by Laravel with MySQL and Meilisearch for fast full-text search. The frontend uses React with Inertia.js for a seamless single-page experience, styled with Tailwind CSS and shadcn/ui components.",
        },
    ];

    return (
        <section id="faq" className="py-24 bg-accent/30">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                        F.A.Q
                    </div>
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground">
                        Everything you need to know about Nexus and getting
                        started.
                    </p>
                </div>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full bg-card rounded-2xl border border-border p-2"
                >
                    {faqs.map((faq, i) => (
                        <AccordionItem
                            key={i}
                            value={`item-${i}`}
                            className="border-b border-border last:border-0 px-4"
                        >
                            <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors py-6 text-foreground">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

/* ─── Footer ─── */
function FooterSection() {
    return (
        <footer className="bg-card border-t border-border py-12">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-foreground">
                            Nexus
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} samuelrods. All rights
                        reserved.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                        >
                            About
                        </a>
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ─── Page ─── */
const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/40 dark:selection:text-blue-300">
            <Head title="Nexus — Open-Source CRM for Modern Teams" />
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
