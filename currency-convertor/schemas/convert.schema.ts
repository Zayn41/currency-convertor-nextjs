import { z } from "zod";

// export const convertSchema = z.object({
//     from: z.string()
//         .trim()
//         .length(3, { message: "From must be exactly 3 characters." }) 
//         .transform(v => v.toUpperCase()),
//     to: z.string()
//         .trim()
//         .length(3, { message: "To must be exactly 3 characters." }) 
//         .transform(v => v.toUpperCase()),
//     amount: z.coerce.number()
//         .positive({ message: "Amount must be greater than zero." }).max(1000000000, { message: "Amount maximun allowed is 1000000000"})
// }).refine((data) => data.from !== data.to, {
//     message: "Source and destination currencies must be different",
//     path: ["to"], 
// });

export const convertSchema = z.object({
    from: z.string()
        .trim()
        .length(3)
        .regex(/^[A-Za-z]{3}$/, { message: "Invalid currency code" })
        .transform(v => v.toUpperCase()),

    to: z.string()
        .trim()
        .length(3)
        .regex(/^[A-Za-z]{3}$/, { message: "Invalid currency code" })
        .transform(v => v.toUpperCase()),

    amount: z.coerce.number()
        .positive({ message: "Amount must be greater than zero." })
        .max(1000000, { message: "Maximum allowed amount is 1,000,000" })
        .refine(val => Number.isFinite(val), {
        message: "Invalid amount"
        })
        .refine(val => {
            const decimal = val.toString().split(".")[1];
            return !decimal || decimal.length <= 4;
            }, {
            message: "Maximum 4 decimal places allowed"
        })
}).refine((data) => data.from !== data.to, {
    message: "Source and destination currencies must be different",
    path: ["to"],
});

export type ConvertSchema = z.infer<typeof convertSchema>;