export const safeOptionId = (id: string | null | undefined, fallback: string): string => {
    return id || fallback;
};

export const hasValidId = (id: string | null | undefined): id is string => {
    return id != null && id !== '';
};
