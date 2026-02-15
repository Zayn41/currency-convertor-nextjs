import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex justify-center items-center min-h-screen p-8 bg-slate-100">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold">404</h1>
                <p className="mb-4 text-xl font-semibold text-slate-500/80">Oops! Page not found</p>
                <Link href="/" className="text-cyan-600 font-semibold hover:text-cyan-600/80 hover:underline">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
