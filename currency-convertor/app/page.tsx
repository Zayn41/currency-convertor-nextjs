import Header from "@/components/Header";
import CurrencyConvertor from "@/components/CurrencyConvertor";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse-glow" style={{ background: "var(--gradient-glow)" }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-pulse-glow" 
                    style={{ background: "var(--gradient-glow)", animationDelay: "1.5s" }}>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
                <Header />
                <CurrencyConvertor />
                <Footer />
            </div>
        </div>
    );
};
