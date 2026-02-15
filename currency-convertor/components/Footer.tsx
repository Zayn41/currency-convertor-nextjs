"use client";
import { motion } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";

const Footer = () => {
    return (
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6}} className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>154+ Currencies</span>
                </div>

                <div className="w-1 h-1 rounded-full bg-slate-500/50"></div>
                <span>Real-time Rates</span>
                <div className="w-1 h-1 rounded-full bg-slate-500/50"></div>
                <span>No Fees</span>
            </div>
        </motion.footer>
    )
}

export default Footer;