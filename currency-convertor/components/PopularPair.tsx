"use client";
import { motion } from "framer-motion";
import { popularPairs, getCurrency } from "@/data/currencies";
import { cn } from "@/lib/utils";
import * as Flags from "country-flag-icons/react/3x2";

interface PopularPairProps {
    onSelect: (from: string, to: string) => void;
    currentFrom: string,
    currentTo: string  
}

const PopularPair = ({ onSelect, currentFrom, currentTo}: PopularPairProps) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Popular Pairs
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {popularPairs.map((pair, index) => {
                    const fromCurrency = getCurrency(pair.from);
                    const toCurrency = getCurrency(pair.to);
                    const isActive = pair.from === currentFrom && pair.to === currentTo;

                    if(!fromCurrency) {
                        return null;
                    }

                    const FlagComponentFrom = Flags[fromCurrency.countryCode as keyof typeof Flags];

                    if(!toCurrency) {
                        return null;
                    }

                    const FlagComponentTo = Flags[toCurrency.countryCode as keyof typeof Flags];

                    return (
                        <motion.button key={`${pair.from}-${pair.to}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1}} 
                            transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                            onClick={() => onSelect(pair.from, pair.to)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl",
                            "text-sm font-medium transition-all duration-200", isActive ? "bg-teal-600 text-teal-50 shadow-[0_0_60px_-10px_rgba(45,212,191,0.4)]"
                            : "bg-slate-200/50 hover:bg-slate-200 border border-slate-200/50 hover:border-teal-600/30")}>
                            
                            <span className="w-6 h-6">
                                {FlagComponentFrom && <FlagComponentFrom className="w-full h-full" />}
                            </span> 
                            <span>{pair?.from}</span>

                            <span className="text-muted-foreground">→</span>

                            <span className="w-6 h-6">
                                {FlagComponentTo && <FlagComponentTo className="w-full h-full" />}
                            </span> 
                            <span>{pair?.to}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularPair;