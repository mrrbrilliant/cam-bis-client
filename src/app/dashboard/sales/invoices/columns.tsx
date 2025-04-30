"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Invoice, InvoiceLine } from "@/lib/api"; // Adjust path alias if needed
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Helper function to format currency
const formatCurrency = (amount: number | null | undefined) => {
	if (amount === null || amount === undefined) return "$0.00";
	return `$` + amount.toFixed(2);
};

// Helper function to calculate total amount
const calculateTotalAmount = (
	lines: InvoiceLine[] | null | undefined
): number => {
	if (!lines) return 0;
	return lines.reduce(
		(sum, line) => sum + (line.quantity || 0) * (line.salesPrice || 0),
		0
	);
};

export const columns: ColumnDef<Invoice>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Invoice ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const id = row.getValue("id") as string;
			return <div className="font-medium">INV-{id}</div>;
		},
		enableHiding: false, // Prevent hiding this essential column
	},
	{
		accessorKey: "customerId",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Customer ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const customerId = row.getValue("customerId") as string | null;
			return <div>{customerId || "N/A"}</div>;
		},
	},
	{
		accessorKey: "txnDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = row.getValue("txnDate") as string | null;
			return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
		},
	},
	{
		id: "amount", // Use a unique id for the calculated column
		accessorFn: (row) => calculateTotalAmount(row.invoiceLines), // Calculate amount using accessorFn
		header: ({ column }) => {
			return (
				<div className="text-right">
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Amount
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const amount = row.getValue("amount") as number; // Get the calculated amount
			return <div className="text-right">{formatCurrency(amount)}</div>;
		},
	},
	// Add more columns as needed, e.g., status, actions
	// {
	//   id: "actions",
	//   cell: ({ row }) => {
	//     const invoice = row.original
	//     // Add action buttons here (e.g., view, edit, delete)
	//     return (
	//       <DropdownMenu>
	//         {/* ... Dropdown menu items ... */}
	//       </DropdownMenu>
	//     )
	//   },
	// },
];
