"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname and useRouter
import { salesTabs } from "@/components/app-sidebar";

// Define the tabs configuration array

export default function SalesLayout({ children }: { children: ReactNode }) {
	// Renamed layout to SalesLayout for clarity
	"use client"; // Add "use client" directive

	const pathname = usePathname(); // Get the current pathname
	const router = useRouter(); // Get the router instance
	// Extract the last segment of the path, default to 'invoices' if it's just /dashboard/sales
	const currentTab = pathname.split("/").pop() || "invoices";
	// Ensure the extracted segment is a valid tab value, otherwise default to 'invoices'
	const defaultValue = salesTabs.some((tab) => tab.value === currentTab)
		? currentTab
		: "invoices";

	// Function to handle tab change and navigate
	const handleTabChange = (value: string) => {
		router.push(`/dashboard/sales/${value}`);
	};

	return (
		<Tabs
			defaultValue={defaultValue}
			className=""
			onValueChange={handleTabChange} // Call handleTabChange on value change
		>
			{" "}
			{/* Use dynamic defaultValue */}
			<TabsList>
				{salesTabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						<tab.icon className="mr-2 h-4 w-4" />
						{tab.title}
					</TabsTrigger>
				))}
			</TabsList>
			{children}
		</Tabs>
	);
}
