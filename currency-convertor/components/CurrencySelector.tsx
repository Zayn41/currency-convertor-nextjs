"use client";
import { ChangeEvent, useState } from "react";
import { motion, AnimatePresence, scale } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { currencies } from "@/data/currencies";
import { Currency } from "@/data/currencies";
import * as Flags from "country-flag-icons/react/3x2";

interface CurrencySelectrorProps {
    value: string,
    onChange: (code: string) => void;
    label: string
}

const CurrencySelector = ({ value, onChange, label}: CurrencySelectrorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const selected = currencies.find(c => c.code === value);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    }

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        setSearch(evt.target.value);
    };

    if(!selected) {
        return null;
    }

    const filtered = currencies.filter(c => 
        c.code.toLowerCase().includes(search.toLowerCase()) || 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelection = (currency: string) => {
        onChange(currency);
        setIsOpen(false);
        setSearch("");
    }

    const FlagComponent = Flags[selected.countryCode as keyof typeof Flags];

    return (
        <div className="relative">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">{label}</span>
            <button onClick={toggleDropdown} className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-200/50 hover:bg-slate-200
                transition-colors border border-slate-200/60 hover:border-slate-200/30 focus:outline-none
                focus:ring-2 focus:ring-slate-200/20">
                <span className="w-8 h-8">
                    {FlagComponent && <FlagComponent className="w-full h-full" />}
                </span>

                <div className="flex-1 text-left">
                    <div className="font-semibold text-lg">{selected?.code}</div>
                    <div className="text-sm text-slate-500">{selected?.name}</div>
                </div>

                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40">
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute top-full mt-2 z-50
                            left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-80">
                            <div className="p-3 border-b border-slate-200">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-500" />
                                    <input onChange={handleSearch} type="text" placeholder="Search currencies..." value={search} className="w-full 
                                    pl-10 pr-4 py-2.5 rounded-2xl bg-slate-200/50 border border-slate-200/50 text-sm 
                                    placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-600/20"/>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-56">
                                {filtered.map((currency) => {
                                    const isSelected: boolean = currency.code === value;

                                    return (
                                        <button onClick={() => handleSelection(currency.code)} key={currency.code} className={`w-full flex items-center gap-3 px-4 py-3 
                                            hover:bg-slate-200/50 transition-colors text-left ${isSelected ? "bg-teal-600/10" : ""}`}>
                                            <span className="w-8 h-8">
                                                {(() => {
                                                    const RowFlag = Flags[currency.countryCode as keyof typeof Flags];
                                                    return RowFlag ? <RowFlag className="w-full h-full" /> : null;
                                                })()}
                                            </span>

                                            <div className="flex-1">
                                                <span className="font-medium">{currency.code}</span>
                                                <span className="text-slate-500 ml-2 text-sm">{currency.name}</span>
                                            </div>

                                            {isSelected && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-teal-600"></motion.div>
                                            )}
                                        </button>
                                    );
                                })}

                                {filtered.length === 0 && (
                                    <div className="px-4 py-6 text-center text-slate-500 text-sm">
                                        No currencies found
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CurrencySelector;