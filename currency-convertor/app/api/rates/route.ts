import { NextResponse } from "next/server";
import { validate } from "@/lib/validators/validation";
import { ConvertSchema, convertSchema } from "@/schemas/convert.schema";
import { ZodError } from "zod";

interface ExchangeRateResponse {
    conversion_rates: Record<string, number>
    result?: string
}

export async function GET(req: Request) {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
        const controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), 5000);

        const { searchParams } = new URL(req.url);
        const json = {
            from: searchParams.get("from") || null,
            to: searchParams.get("to") || null,
            amount: searchParams.get("amount") || 1
        };
        const body: ConvertSchema = validate(convertSchema, json);
        const { from, to, amount } = body;

        const { API_KEY, API_URL } = process.env;

        if(!API_KEY || !API_URL) {
            return NextResponse.json({
                success: false,
                message: "Server configuration error"
            }, { status: 500 });
        }

        const response = await fetch(`${API_URL}/${API_KEY}/latest/${from}`, {
            signal: controller.signal,
            headers: {
                "Accept": "application/json"
            },
            next: { revalidate: 3600 }
        });

        console.log("API_URL:", API_URL);
        console.log("API_KEY:", API_KEY);
        console.log("FROM:", from);
        console.log("FINAL URL:", `${API_URL}/${API_KEY}/latest/${from}`);

        if(!response.ok) {
            const status = response.status;
            if(status === 404) {
                return NextResponse.json({
                    success: false,
                    message: `Currency ${from} not found`
                }, { status: 400 });
            }
            throw new Error(`API error: ${status}`);
        }

        const data: ExchangeRateResponse = await response.json();
        if(!data.conversion_rates) {
            throw new Error("Invalid API response structure");
        }

        const rate = data.conversion_rates[to];
        if(rate === undefined || typeof rate !== "number") {
            return NextResponse.json({
                success: false,
                message: `Currency ${to} not supported`
            }, { status: 400 });
        }

        const result = Number((amount * rate).toFixed(4));

        return NextResponse.json(
            {
                success: true,
                message: "Currency converted successfully!",
                data: {  result, rate }
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                },
            },
        );
    } catch(error: any) {
        if(error.name === "AbortError") {
            return NextResponse.json({
                success: false,
                message: "Request timeout"
            }, { status: 408 });
        }

        if(error instanceof ZodError) {
            return NextResponse.json({
                success: false,
                message: "Invalid requests data",
                errors: error.flatten()
            }, { status: 400 });
        }

        console.error('Currency conversion error:', error);

        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    } finally {
        if(timeout) {
            clearTimeout(timeout);
        }
    }
}