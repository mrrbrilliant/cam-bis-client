"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BisInvoiceApiService, Invoice, InvoiceLine } from "@/lib/api"; // Adjust path alias if needed
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";

// Define the query key for a single invoice
const invoiceQueryKey = (id: string) => ["invoice", id];

export default function InvoiceDetailPage() {
	const params = useParams();
	const invoiceId = params.invoiceId as string; // Get invoiceId from URL params

	const {
		data: invoice,
		isLoading,
		isError,
		error,
	} = useQuery<Invoice, Error>({
		// Expect a single Invoice object
		queryKey: invoiceQueryKey(invoiceId),
		queryFn: () => BisInvoiceApiService.getInvoice1({ id: invoiceId }), // Use getInvoice1 with the id
		enabled: !!invoiceId, // Only run query if invoiceId is available
	});

	const renderLoading = () => (
		<div className="space-y-4">
			<Skeleton className="h-8 w-1/2" />
			<Skeleton className="h-4 w-1/4" />
			<Skeleton className="h-4 w-1/3" />
			<div className="mt-6 space-y-2">
				<Skeleton className="h-6 w-1/4" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);

	const renderError = () => (
		<Alert variant="destructive">
			<Terminal className="h-4 w-4" />
			<AlertTitle>Error Fetching Invoice</AlertTitle>
			<AlertDescription>
				{error?.message ||
					"An unexpected error occurred while fetching the invoice details."}
			</AlertDescription>
		</Alert>
	);

	const renderInvoiceDetails = () => {
		if (!invoice) return <p>Invoice not found.</p>;

		const totalAmount =
			invoice.invoiceLines
				?.reduce(
					(sum: number, line: InvoiceLine) =>
						sum + (line.quantity || 0) * (line.salesPrice || 0),
					0
				)
				.toFixed(2) || "0.00";

		return (
			<>
				<CardHeader>
					<CardTitle>Invoice INV-{invoice.id}</CardTitle>
					<CardDescription>
						Date:{" "}
						{invoice.txnDate
							? new Date(invoice.txnDate).toLocaleDateString()
							: "N/A"}{" "}
						| Customer ID:{" "}
						<Link
							href={`/dashboard/customers/${invoice.customerId}`}
							className="underline hover:text-primary"
						>
							{invoice.customerId || "N/A"}
						</Link>{" "}
						{/* Assuming a customer detail page exists */}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<h3 className="text-lg font-semibold mb-2">Invoice Lines</h3>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Item ID</TableHead>
								<TableHead className="text-right">Quantity</TableHead>
								<TableHead className="text-right">Unit Price</TableHead>
								<TableHead className="text-right">Line Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoice.invoiceLines?.map((line, index) => (
								<TableRow key={index}>
									{" "}
									{/* Use index if line ID isn't available */}
									<TableCell>{line.itemId || "N/A"}</TableCell>
									<TableCell className="text-right">
										{line.quantity || 0}
									</TableCell>
									<TableCell className="text-right">
										${(line.salesPrice || 0).toFixed(2)}
									</TableCell>
									<TableCell className="text-right">
										$
										{((line.quantity || 0) * (line.salesPrice || 0)).toFixed(2)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<div className="mt-4 text-right font-bold text-lg">
						Total Amount: ${totalAmount}
					</div>
				</CardContent>
			</>
		);
	};

	return (
		<Card>
			{isLoading && <CardContent>{renderLoading()}</CardContent>}
			{isError && <CardContent>{renderError()}</CardContent>}
			{!isLoading && !isError && renderInvoiceDetails()}
		</Card>
	);
}
