"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { TriangleAlert } from "lucide-react";
import CurrencySelector from "./CurrencySelector";
import AmountInput from "./AmountInput";
import SwapButton from "./SwapButton";
import ExchangeRate from "./ExchangeRate";
import PopularPair from "./PopularPair";

const CurrencyConvertor = () => {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("INR");
    const [amount, setAmount] = useState("1000");
    const [convertedAmount, setConvertedAmount] = useState("");
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const debouncedAmount = useDebounce(amount, 500);

    const validateData = (from: string, to:string, amountStr: string) => {
        const parsedAmount = Number(amountStr);

        if(!from || !to) {
            return "Invalid currency Selection";
        }

        if(from === to) {
            return "From and To currencies must be different";
        }

        if(!amountStr || isNaN(parsedAmount)) {
            return "Invalid amount";
        }

        if(parsedAmount <= 0 || parsedAmount > 1000000000) {
            return "Amount must be greater than zero";
        }

        return null;
    };

    useEffect(() => {
        const validationError = validateData(fromCurrency, toCurrency, debouncedAmount);
        if(validationError) {
            console.log(validationError);
            setError(validationError);
            setConvertedAmount("");
            setExchangeRate(null);
            return;
        }

        if(abortRef.current) {
            abortRef.current.abort();
        }

        const controller = new AbortController();
        abortRef.current = controller;

        const convertCurrency = async () => {
            const timer = setTimeout(() => setIsLoading(true), 200);
            setError(null);

            try {
                const response = await fetch(`/api/rates?from=${fromCurrency}&to=${toCurrency}&amount=${debouncedAmount}`,
                    { signal: controller.signal}
                );

                const data = await response.json();
                if(!response.ok) {
                    console.log(data.message || "Conversion failed");
                    setError(data.message || "Conversion failed");
                    setIsLoading(false);
                    return;
                }

                if(!data.success) {
                    console.log(data.message || "Failed to convert currency");
                    setError(data.message);
                    return;
                }

                const result = data?.data?.result;

                if(typeof result === "number") {
                    setConvertedAmount(result.toString());
                }

                const rate = data?.data?.rate;
                if(typeof rate === "number") {
                    setExchangeRate(rate);
                }

            } catch(error: any) {
                if(error.name !== "AbortError") {
                    setError(error.message || "Error in converting currency");
                    setConvertedAmount("");
                    setExchangeRate(null);
                }
            } finally {
                if(abortRef.current === controller) {
                    setIsLoading(false);
                    clearTimeout(timer);
                }
            }
        };

        convertCurrency();

        return () => {
            controller.abort();
            abortRef.current = null;
        }
    }, [fromCurrency, toCurrency, debouncedAmount]);

    const handleSwap = () => {
        const prevFromCurrency: string = fromCurrency;
        const prevToCurrency: string = toCurrency;

        setFromCurrency(prevToCurrency);
        setToCurrency(prevFromCurrency);
    };

    const handlePairSelect = (from: string, to:string) => {
        setFromCurrency(from);
        setToCurrency(to);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="max-w-lg w-full mx-auto">
            <div className="bg-white backdrop-blur-2xl border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-lg">
                <div className="space-y-4">
                    <CurrencySelector value={fromCurrency} onChange={setFromCurrency} label="From" />
                    <AmountInput value={amount} onChange={setAmount} currencyCode={fromCurrency} autoFocus />
                </div>

                <SwapButton onClick={handleSwap} />

                <div className="space-y-4">
                    <CurrencySelector value={toCurrency} onChange={setToCurrency} label="To" />
                    {/* <AmountInput value={convertedAmout} onChange={() => {}} currencyCode={toCurrency} readOnly /> */}

                    <div className="relative">
                        <AmountInput value={convertedAmount} onChange={() => {}} currencyCode={toCurrency} readOnly />

                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
                                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-4 bg-red-100/60 flex 
                            items-center justify-center gap-2 border border-red-200/60 text-red-700 rounded-xl backdrop-blur-md">
                            <TriangleAlert className="w-5 h-5" />
                            <p className="text-sm font-medium leading-relaxed">
                                {error}
                            </p>
                        </motion.div>
                    )}
                </div>

                {exchangeRate !== null && !error && (
                    <div className="mt-6">
                        <ExchangeRate from={fromCurrency} to={toCurrency} rate={exchangeRate} />
                    </div>
                )}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mt-8">
                <PopularPair onSelect={handlePairSelect} currentFrom={fromCurrency} currentTo={toCurrency} />
            </motion.div>
        </motion.div>
    );
};

export default CurrencyConvertor;