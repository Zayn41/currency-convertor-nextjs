"use client";
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Header = () => {
    return (
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-600/10 border border-teal-600/20 mb-6">
                <Sparkles className="w-4 h-4 text-teal-600/90" />
                <span className="text-sm font-medium text-teal-600/90">Fast & Accurate</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Currency{" "}
                <span className="bg-linear-to-br from-teal-600 to-teal-500 bg-clip-text text-transparent">Convertor</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500/90 max-w-md mx-auto">
                Convert between 154+ currencies with real-time exchange rates
            </p>
        </motion.header>
    );
};

export default Header;
