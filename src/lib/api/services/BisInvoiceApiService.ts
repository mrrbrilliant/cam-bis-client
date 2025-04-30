/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Customer } from '../models/Customer';
import type { Invoice } from '../models/Invoice';
import type { Item } from '../models/Item';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BisInvoiceApiService {
    /**
     * @returns Item OK
     * @throws ApiError
     */
    public static item(): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/item',
        });
    }
    /**
     * @returns Customer OK
     * @throws ApiError
     */
    public static customer(): CancelablePromise<Array<Customer>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer',
        });
    }
    /**
     * @returns Invoice OK
     * @throws ApiError
     */
    public static getInvoice(): CancelablePromise<Array<Invoice>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invoice',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static invoice({
        requestBody,
    }: {
        requestBody?: Invoice,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invoice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getInvoice1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invoice/{id}',
            path: {
                'id': id,
            },
        });
    }
}
