"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Assuming you use sonner for toasts
import { BisInvoiceApiService, Invoice, InvoiceLine } from "@/lib/api"; // Adjust path if needed
import { PlusCircle, Wand2 } from "lucide-react"; // Icons for the trigger button and random fill button

// Define the form schema using Zod based on the Invoice model and sample data
// Added UUID validation and itemDescription field
const invoiceFormSchema = z.object({
	customerId: z.string().uuid({ message: "Invalid Customer ID format" }), // Validate as UUID
	refNumber: z.string().optional(),
	billAddress: z.string().optional(),
	phone: z.string().optional(),
	invoiceLines: z
		.array(
			z.object({
				itemId: z.string().uuid({ message: "Invalid Item ID format" }), // Validate as UUID
				quantity: z.coerce
					.number()
					.int({ message: "Quantity must be a whole number" })
					.nonnegative({ message: "Quantity cannot be negative" })
					.min(1, "Quantity must be at least 1"), // Keep min 1 if required
				salesPrice: z.coerce
					.number()
					.nonnegative({ message: "Price cannot be negative" }),
				itemDescription: z.string().optional(), // Added itemDescription
			})
		)
		.min(1, "At least one invoice line is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// Define the query key for invoices (same as in the page)
const invoicesQueryKey = ["invoices", "list"];

export function InvoiceCreateDialog() {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<InvoiceFormValues>({
		resolver: zodResolver(invoiceFormSchema),
		defaultValues: {
			customerId: "",
			refNumber: "",
			billAddress: "",
			phone: "",
			invoiceLines: [
				{ itemId: "", quantity: 1, salesPrice: 0, itemDescription: "" }, // Added itemDescription default
			], // Start with one empty line
		},
	});

	// TODO: Implement useFieldArray for dynamic invoice lines

	const createInvoiceMutation = useMutation({
		mutationFn: (newInvoice: Omit<Invoice, "id" | "txnDate">) =>
			BisInvoiceApiService.invoice({ requestBody: newInvoice }), // Corrected: Use the 'invoice' method for POST
		onSuccess: () => {
			toast.success("Invoice created successfully!");
			queryClient.invalidateQueries({ queryKey: invoicesQueryKey }); // Invalidate cache to refetch
			setOpen(false); // Close the dialog
			form.reset(); // Reset the form
		},
		onError: (error) => {
			toast.error(`Failed to create invoice: ${error.message}`);
		},
	});

	function onSubmit(values: InvoiceFormValues) {
		console.log("Form submitted:", values);
		// Prepare data for API - might need transformation depending on API expectations
		const apiData: Omit<Invoice, "id" | "txnDate"> = {
			customerId: values.customerId,
			refNumber: values.refNumber || null,
			billAddress: values.billAddress || null,
			phone: values.phone || null,
			// Map form lines to API lines - ensure properties match InvoiceLine type
			invoiceLines: values.invoiceLines.map((line) => ({
				// id: undefined, // API likely assigns ID
				// invoiceId: undefined, // API likely assigns this
				itemId: line.itemId,
				quantity: line.quantity,
				salesPrice: line.salesPrice,
				itemDescription: line.itemDescription || null, // Map itemDescription
				// Ensure other required InvoiceLine fields from the API model are handled
				// description: line.description || null, // Remove this if itemDescription replaces it
			})) as InvoiceLine[], // Cast might be needed depending on exact types
		};
		createInvoiceMutation.mutate(apiData);
	}

	// Function to generate random data and fill the form
	const fillRandomData = () => {
		const randomCustomerId = crypto.randomUUID();
		const randomItemId = crypto.randomUUID();
		const randomQuantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10
		const randomPrice = parseFloat((Math.random() * 90 + 10).toFixed(2)); // Random price between 10.00 and 100.00
		const randomDescription = `Random Item ${Math.floor(Math.random() * 1000)}`;

		form.setValue("customerId", randomCustomerId);
		// Reset lines and add one random line
		form.setValue("invoiceLines", [
			{
				itemId: randomItemId,
				quantity: randomQuantity,
				salesPrice: randomPrice,
				itemDescription: randomDescription,
			},
		]);
		// Optionally fill other fields if needed
		// form.setValue("refNumber", `REF-${Math.floor(Math.random() * 10000)}`);
		// form.setValue("billAddress", "123 Random St, Anytown");
		// form.setValue("phone", "555-1234");

		// Trigger validation after setting values
		form.trigger();
		toast.info("Form filled with random data.");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<PlusCircle className="mr-2 h-4 w-4" />
					Create Invoice
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				{" "}
				{/* Adjust width as needed */}
				<DialogHeader>
					<DialogTitle>Create New Invoice</DialogTitle>
					<div className="flex justify-between items-center">
						<DialogDescription>
							Fill in the details below to create a new invoice.
						</DialogDescription>
						{/* Add button to fill random data */}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={fillRandomData}
							title="Fill with random data"
						>
							<Wand2 className="h-4 w-4" />
						</Button>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="customerId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Customer ID</FormLabel>
									<FormControl>
										<Input placeholder="Enter customer ID" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Add fields for refNumber, billAddress, phone if needed */}

						<h4 className="text-sm font-medium">Invoice Lines</h4>
						{/* Basic rendering for one line - needs dynamic handling */}
						{form.getValues("invoiceLines").map((line, index) => (
							<div
								key={index}
								className="grid grid-cols-5 gap-2 border p-2 rounded" // Adjusted grid columns
							>
								<FormField
									control={form.control}
									name={`invoiceLines.${index}.itemId`}
									render={({ field }) => (
										<FormItem className="col-span-2">
											{" "}
											{/* Adjusted span */}
											<FormLabel>Item ID</FormLabel>
											<FormControl>
												<Input placeholder="Item ID (UUID)" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`invoiceLines.${index}.quantity`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Qty</FormLabel>
											<FormControl>
												<Input type="number" placeholder="1" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`invoiceLines.${index}.salesPrice`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="0.00"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Added itemDescription field */}
								<FormField
									control={form.control}
									name={`invoiceLines.${index}.itemDescription`}
									render={({ field }) => (
										<FormItem className="col-span-5">
											{" "}
											{/* Span full width */}
											<FormLabel>Item Description (Optional)</FormLabel>
											<FormControl>
												<Input placeholder="Description" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						))}
						{/* TODO: Add button to add more lines */}
						{/* TODO: Add button to remove lines */}
						<FormMessage>
							{form.formState.errors.invoiceLines?.message}
						</FormMessage>

						<DialogFooter>
							<Button
								type="button"
								variant="ghost"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={createInvoiceMutation.isPending}>
								{createInvoiceMutation.isPending
									? "Creating..."
									: "Create Invoice"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
