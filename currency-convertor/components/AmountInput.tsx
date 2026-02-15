"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getCurrency } from "@/data/currencies";
import * as Flags from "country-flag-icons/react/3x2";

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    currencyCode: string;
    readOnly?: boolean;
    autoFocus?: boolean;
}

const AmountInput = ({ value, onChange, currencyCode, readOnly = false, autoFocus = false} : AmountInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const currency = getCurrency(currencyCode);

    useEffect(() => {
        if(autoFocus && inputRef.current) {
            inputRef.current.focus();
        }

    }, [autoFocus]);

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value;

        if(/^[0-9]*\.?[0-9]*$/.test(newValue) || newValue === '') {
            onChange(newValue);
        }
    }

    const displayValue = readOnly && value 
    ? parseFloat(value).toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    : value;

    if(!currency) {
        return null;
    }

    const FlagComponent = Flags[currency.countryCode as keyof typeof Flags];

    return (
        <div className={cn("relative rounded-xl overflow-hidden", readOnly ? "bg-slate-200/30" : "bg-slate-200/50", "border border-slate-200/60",
            !readOnly && "focus-within:ring-2 focus-within:ring-teal-600/20 focus-within:border-teal-600/30")}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="w-8 h-8">
                    {FlagComponent && <FlagComponent className="w-full h-full" />}
                </span> 
                
                <span className="text-lg font-medium -translate-y-2 text-slate-500">{currency?.symbol}</span>
            </div>

            <input ref={inputRef} type={readOnly ? "text" : "text"} inputMode="decimal" value={displayValue} onChange={handleChange} readOnly={readOnly}
            placeholder="0.00" className={cn("w-full py-5 pl-24 pr-4 text-right", "bg-transparent text-3xl font-semibold font-mono",
            "placeholder:text-slate-500/50", "focus:outline-none", readOnly && "cursor-default text-slate-900/80")} />
        </div>
    );
};

export default AmountInput;