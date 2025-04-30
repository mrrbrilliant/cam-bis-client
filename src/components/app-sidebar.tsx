"use client";

import * as React from "react";
import {
	AudioWaveform,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	LayoutDashboard,
	ArrowRightLeft,
	ShoppingCart,
	CreditCard,
	Users,
	BarChart,
	Briefcase,
	Clock,
	PiggyBank,
	Landmark,
	Calculator,
	Banknote,
	Store,
	AppWindow,
	ReceiptText,
	FileText,
	FileClock,
	ClipboardList,
	Repeat,
	Package,
	LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

export const salesTabs: {
	value: string;
	title: string;
	icon: LucideIcon;
	url: string;
}[] = [
	{
		value: "overview",
		title: "Overview",
		icon: LayoutDashboard,
		url: "/dashboard/sales/overview",
	},
	{
		value: "all-sales",
		title: "All sales",
		icon: ReceiptText,
		url: "/dashboard/sales/all-sales",
	},
	{
		value: "invoices",
		title: "Invoices",
		icon: FileText,
		url: "/dashboard/sales/invoices",
	},
	{
		value: "estimates",
		title: "Estimates",
		icon: FileClock,
		url: "/dashboard/sales/estimates",
	},
	{
		value: "sales-orders",
		title: "Sales orders",
		icon: ClipboardList,
		url: "/dashboard/sales/sales-orders",
	},
	{
		value: "recurring-payments",
		title: "Recurring payments",
		icon: Repeat,
		url: "/dashboard/sales/recurring-payments",
	},
	{
		value: "customers",
		title: "Customers",
		icon: Users,
		url: "/dashboard/sales/customers",
	},
	{
		value: "products-services",
		title: "Products & services",
		icon: Package,
		url: "/dashboard/sales/products-services",
	},
];

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Dashboards",
			url: "#",
			icon: LayoutDashboard,
		},
		{
			title: "Transactions",
			url: "#",
			icon: ArrowRightLeft,
		},
		{
			title: "Sales",
			url: "/dashboard/sales",
			icon: ShoppingCart,
			isActive: true,
			items: salesTabs,
		},
		{
			title: "Expenses",
			url: "#",
			icon: CreditCard,
		},
		{
			title: "Customers & leads",
			url: "#",
			icon: Users,
		},
		{
			title: "Reports",
			url: "#",
			icon: BarChart,
		},
		{
			title: "Payroll",
			url: "#",
			icon: Briefcase,
		},
		{
			title: "Time",
			url: "#",
			icon: Clock,
		},
		{
			title: "Budgets",
			url: "#",
			icon: PiggyBank,
		},
		{
			title: "Taxes",
			url: "#",
			icon: Landmark,
		},
		{
			title: "My accountant",
			url: "#",
			icon: Calculator,
		},
		{
			title: "Lending & banking",
			url: "#",
			icon: Banknote,
		},
		{
			title: "Commerce",
			url: "#",
			icon: Store,
		},
		{
			title: "Apps",
			url: "#",
			icon: AppWindow,
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: Map,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
