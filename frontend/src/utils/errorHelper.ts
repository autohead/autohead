// utils/errorHelper.ts
export function getUserFriendlyError(err: any, fallback = 'Failed to add data'): string {
    const errors = err?.data?.errors;
    const status = err?.status;

    // Server errors (500+) or no errors -> generic fallback
    if (!errors || (status && status >= 500)) return fallback;

    // Validation / client errors
    if (typeof errors === 'string') {
        return errors; // simple string errors (rare)
    }

    if (typeof errors === 'object') {
        // pick the first meaningful error message
        const firstValue = Object.values(errors)[0];
        if (Array.isArray(firstValue) && firstValue.length > 0) {
            return firstValue[0]; // user-friendly message
        }
        if (typeof firstValue === 'string') return firstValue;
    }

    return fallback; // fallback if nothing matches
}
