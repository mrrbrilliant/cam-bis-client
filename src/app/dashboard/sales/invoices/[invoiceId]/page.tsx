"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
	BisInvoiceApiService,
	Invoice,
	InvoiceLine,
	Customer,
	Item,
} from "@/lib/api"; // Adjust path alias if needed
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

const invoiceQueryKey = (id: string) => ["invoice", id];
const customersQueryKey = () => ["customers"];
const itemsQueryKey = () => ["items"];

export default function InvoiceDetailPage() {
	const params = useParams();
	const invoiceId = params.invoiceId as string; // Get invoiceId from URL params

	const {
		data: invoice,
		isLoading: isLoadingInvoice,
		isError: isErrorInvoice,
		error: errorInvoice,
	} = useQuery<Invoice, Error>({
		queryKey: invoiceQueryKey(invoiceId),
		queryFn: () => BisInvoiceApiService.getInvoice1({ id: invoiceId }),
		enabled: !!invoiceId,
	});

	const { data: customers, isLoading: isLoadingCustomers } = useQuery<
		Customer[],
		Error
	>({
		queryKey: customersQueryKey(),
		queryFn: () => BisInvoiceApiService.customer(),
		enabled: !!invoice?.customerId, // Only fetch if customerId is available
	});

	const { data: items, isLoading: isLoadingItems } = useQuery<Item[], Error>({
		queryKey: itemsQueryKey(),
		queryFn: () => BisInvoiceApiService.item(),
		enabled: !!invoice?.invoiceLines && invoice.invoiceLines.length > 0, // Only fetch if there are invoice lines
	});

	const currentCustomer = React.useMemo(() => {
		if (!invoice || !customers) return null;
		return customers.find((c) => c.id === invoice.customerId);
	}, [invoice, customers]);

	const itemsMap = React.useMemo(() => {
		if (!items) return new Map<string, Item>();
		return new Map(items.map((item) => [item.id || "", item]));
	}, [items]);

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
			<AlertTitle>Error Fetching Invoice Data</AlertTitle>
			<AlertDescription>
				{errorInvoice?.message ||
					"An unexpected error occurred while fetching invoice details."}
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
							: "N/A"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingCustomers && !currentCustomer && (
						<div className="mb-4">
							<Skeleton className="h-6 w-1/3 mb-2" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					)}
					{!isLoadingCustomers && currentCustomer && (
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-1">Customer Details</h3>
							<p>
								<strong>Name:</strong> {currentCustomer.name || "N/A"}
							</p>
							{currentCustomer.companyName && (
								<p>
									<strong>Company:</strong> {currentCustomer.companyName}
								</p>
							)}
							<p>
								<strong>Contact:</strong> {currentCustomer.phone || "N/A"}
							</p>
							<p>
								<strong>Address:</strong> {currentCustomer.address || "N/A"}
							</p>
							<p>
								Customer ID:{" "}
								<Link
									href={`/dashboard/customers/${currentCustomer.id}`}
									className="underline hover:text-primary"
								>
									{currentCustomer.id}
								</Link>
							</p>
						</div>
					)}
					{!isLoadingCustomers && !currentCustomer && invoice?.customerId && (
						<Alert variant="default" className="mb-4">
							<AlertTitle>Customer Information</AlertTitle>
							<AlertDescription>
								Could not load details for customer ID: {invoice.customerId}.
							</AlertDescription>
						</Alert>
					)}

					<h3 className="text-lg font-semibold mb-2">Invoice Lines</h3>
					{isLoadingItems && <Skeleton className="h-10 w-full mb-2" />}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Item</TableHead>
								<TableHead className="text-right">Quantity</TableHead>
								<TableHead className="text-right">Unit Price</TableHead>
								<TableHead className="text-right">Line Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoice.invoiceLines?.map((line, index) => {
								const itemDetail = line.itemId
									? itemsMap.get(line.itemId)
									: null;
								return (
									<TableRow key={index}>
										<TableCell>
											{itemDetail
												? `${itemDetail.itemName || "Unknown Item"} ${
														itemDetail.itemDescription
															? `(${itemDetail.itemDescription})`
															: ""
												  }`
												: line.itemId || "N/A"}
											{isLoadingItems && !itemDetail && line.itemId && (
												<Skeleton className="h-4 w-20 inline-block ml-2" />
											)}
										</TableCell>
										<TableCell className="text-right">
											{line.quantity || 0}
										</TableCell>
										<TableCell className="text-right">
											${(line.salesPrice || 0).toFixed(2)}
										</TableCell>
										<TableCell className="text-right">
											$
											{((line.quantity || 0) * (line.salesPrice || 0)).toFixed(
												2
											)}
										</TableCell>
									</TableRow>
								);
							})}
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
			{isLoadingInvoice && <CardContent>{renderLoading()}</CardContent>}
			{isErrorInvoice && <CardContent>{renderError()}</CardContent>}
			{!isLoadingInvoice && !isErrorInvoice && renderInvoiceDetails()}
		</Card>
	);
}
