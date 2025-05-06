"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BisInvoiceApiService, Invoice } from "@/lib/api"; // Removed InvoiceLine as it's handled in columns.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { InvoiceCreateDialog } from "@/components/invoice-create-dialog";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table"; // Import the DataTable component
import { columns } from "./columns"; // Import the columns definition

// Define the query key for invoices
const invoicesQueryKey = ["invoices", "list"];

export default function InvoicesPage() {
	const router = useRouter();
	const {
		data: invoices,
		isLoading,
		isError,
		error,
	} = useQuery<Invoice[], Error>({
		queryKey: invoicesQueryKey,
		queryFn: () => BisInvoiceApiService.getInvoice(),
	});

	const handleRowClick = (invoice: Invoice) => {
		router.push(`/dashboard/sales/invoices/${invoice.id}`);
	};

	const renderLoading = () => (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-1/4" /> {/* Filter skeleton */}
				<Skeleton className="h-8 w-[120px]" /> {/* Columns button skeleton */}
			</div>
			<Skeleton className="h-[50px] w-full" /> {/* Header row skeleton */}
			<Skeleton className="h-[40px] w-full" /> {/* Data row skeleton */}
			<Skeleton className="h-[40px] w-full" />
			<Skeleton className="h-[40px] w-full" />
			<div className="flex items-center justify-end space-x-2">
				<Skeleton className="h-8 w-[100px]" /> {/* Pagination skeleton */}
				<Skeleton className="h-8 w-[80px]" />
				<Skeleton className="h-8 w-[80px]" />
			</div>
		</div>
	);

	const renderError = () => (
		<Alert variant="destructive">
			<Terminal className="h-4 w-4" />
			<AlertTitle>Error Fetching Invoices</AlertTitle>
			<AlertDescription>
				{error?.message || "An unexpected error occurred."}
			</AlertDescription>
		</Alert>
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Invoices</CardTitle>
				<InvoiceCreateDialog />
			</CardHeader>
			<CardContent>
				{isLoading && renderLoading()}
				{isError && renderError()}
				{!isLoading && !isError && invoices && (
					<DataTable
						columns={columns}
						data={invoices}
						filterColumnId="customerId" // Example: Allow filtering by customer ID
						filterPlaceholder="Filter by Customer ID..."
						onRowClick={handleRowClick} // Pass the row click handler
					/>
				)}
			</CardContent>
		</Card>
	);
}
