/**
 * Format a number as a currency string.
 *
 * @param {number|string} value - The numeric value to format
 * @param {string} currencyCode - The ISO currency code (e.g., 'USD', 'EUR')
 * @returns {string} - The formatted currency string
 */
export function formatCurrency(value: any, currencyCode: string = "USD") {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
        return value;
    }

    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
    } catch (error) {
        console.error("Error formatting currency:", error);
        return `${currencyCode} ${numericValue.toLocaleString()}`;
    }
}

export const COMMON_CURRENCIES = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
];
