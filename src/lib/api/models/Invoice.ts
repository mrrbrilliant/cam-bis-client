/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLine } from './InvoiceLine';
export type Invoice = {
    id?: string;
    txnDate?: string;
    refNumber?: string | null;
    customerId?: string;
    billAddress?: string | null;
    phone?: string | null;
    invoiceLines?: Array<InvoiceLine> | null;
};

