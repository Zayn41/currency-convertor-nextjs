import currencyCodes from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode: string; // ISO Alpha-2
}

const preferredFlags: Record<string, string> = {
    USD: "US",
    EUR: "EU",
    GBP: "GB",
    AUD: "AU",
    INR: "IN",   
    CAD: "CA",
    NZD: "NZ",
    XOF: "SN",
    XAF: "CM",
};

export const currencies: Currency[] = currencyCodes
    .codes()
    .filter(code =>
        !code.startsWith("X") &&
        !["BOV", "CHE", "CHW", "CLF", "MXV", "USN", "UYI", "UYW"].includes(code)
    )
    .map(code => {
    const data = currencyCodes.code(code);

    let countryName = data?.countries?.[0] || "";
    countryName = countryName
      .replace(/\(.*?\)/g, "")  
      .replace(/’/g, "'")      
      .trim();

    const alpha2 = code === "EUR" ? "EU" : countries.getAlpha2Code(countryName, "en") || "";

    return {
        code,
        name: data?.currency || "",
        symbol: getSymbolFromCurrency(code) || "",
        countryCode: preferredFlags[code] || alpha2,
    };
});

export const popularPairs = [
    { from: 'USD', to: 'EUR' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'JPY' },
    { from: 'GBP', to: 'USD' },
    { from: 'USD', to: 'INR' },
    { from: 'EUR', to: 'CHF' },
];

export const getCurrency = (code: string): Currency | undefined => {
    return currencies.find(c => c.code === code);
};