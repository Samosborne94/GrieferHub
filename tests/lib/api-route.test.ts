/** @jest-environment node */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
    apiSuccess,
    handleApiError,
    parseJsonBody,
} from '@/lib/api/route'
import { forbidden } from '@/lib/errors'

describe('api route helpers', () => {
    it('parses and validates JSON bodies', async () => {
        const request = new NextRequest('http://localhost/api/test', {
            method: 'POST',
            body: JSON.stringify({ name: 'GrieferHub' }),
            headers: { 'content-type': 'application/json' },
        })

        const result = await parseJsonBody(
            request,
            z.object({ name: z.string().min(1) })
        )

        expect(result).toEqual({ name: 'GrieferHub' })
    })

    it('maps validation failures to consistent API errors', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
        const request = new NextRequest('http://localhost/api/test', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'content-type': 'application/json',
                'x-request-id': 'req-42',
            },
        })

        let response

        try {
            await parseJsonBody(request, z.object({ name: z.string().min(1) }))
            throw new Error('Expected parseJsonBody to fail')
        } catch (error) {
            response = handleApiError(error, request, 'Create test entity')
        }

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({
            success: false,
            error: 'VALIDATION_ERROR',
            message: 'Invalid input: expected string, received undefined',
        })

        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
    })

    it('preserves explicit app errors and success envelopes', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
        const request = new NextRequest('http://localhost/api/test', {
            method: 'GET',
        })

        const errorResponse = handleApiError(
            forbidden('No access to this resource'),
            request,
            'Fetch protected entity'
        )
        const successResponse = apiSuccess({ ok: true }, { status: 201, message: 'Created' })

        expect(errorResponse.status).toBe(403)
        await expect(errorResponse.json()).resolves.toEqual({
            success: false,
            error: 'FORBIDDEN',
            message: 'No access to this resource',
        })

        expect(successResponse.status).toBe(201)
        await expect(successResponse.json()).resolves.toEqual({
            success: true,
            data: { ok: true },
            message: 'Created',
        })

        spy.mockRestore()
    })
})
