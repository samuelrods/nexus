export default function singularize(str: any) {
    if (!str) return str;

    if (str.endsWith("ies")) {
        return str.slice(0, -3) + "y";
    }
    if (str.endsWith("es")) {
        // Handle cases like "Addresses" -> "Address"
        // But be careful with "Deals" (if it was somehow "Deales")
        // Most common -es plurals in English: -ses, -ches, -shes, -xes, -zes
        const esEndings = ["ses", "ches", "shes", "xes", "zes"];
        if (
            esEndings.some((ending: any) => str.toLowerCase().endsWith(ending))
        ) {
            return str.slice(0, -2);
        }
    }
    if (str.endsWith("s")) {
        return str.slice(0, -1);
    }
    return str;
}
