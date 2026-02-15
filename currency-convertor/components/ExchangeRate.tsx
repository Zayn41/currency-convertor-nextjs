"use client";
import { animate, motion } from "framer-motion";
import { TrendingUp, Clock } from "lucide-react";
import { getCurrency } from "@/data/currencies";

interface ExchangeRateProps {
    from: string,
    to: string,
    rate: number
}

const ExchangeRate = ({ from, to, rate }: ExchangeRateProps) => {
    const fromCurrency = getCurrency(from);
    const toCurrency = getCurrency(to);
  
    return (
        <motion.div key={`${from}-${to}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center
            p-4 rounded-xl bg-linear-to-r from-teal-600/5 to-teal-600/10 border border-teal-600/20">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-teal-600/10">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                </div>

                <div>
                    <div className="text-sm text-slate-500">Exchange Rate</div>
                    <div className="font-semibold">
                        1 {from} = <span className="text-teal-600">{rate.toFixed(4)}</span> {to}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Live rate</span>
            </div>
        </motion.div>
    );
};

export default ExchangeRate;