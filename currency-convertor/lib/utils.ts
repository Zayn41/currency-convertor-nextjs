import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputsValue: ClassValue[]) => {
    return twMerge(clsx(inputsValue));
};