"use client";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";

interface SwapButtonProps {
    onClick: () => void
}

const SwapButton = ({ onClick }: SwapButtonProps) => {
    return (
        <div className="flex justify-center -my-3 relative z-10">
            <motion.button onClick={onClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95, rotate: 180}} className="p-3 rounded-full
                bg-teal-600/85 text-teal-50 shadow-[0_0_60px_-10px_rgba(45,212,191,0.4)] hover:shadow-lg transition-shadow duration-300
                focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:ring-offset-2 focus:ring-offset-white">
                <ArrowUpDown className="w-5 h-5" />
            </motion.button>
        </div>
    );
};

export default SwapButton;