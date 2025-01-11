export function formatTimestamp(isoString: string): string | null {
    const date = new Date(isoString);
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
        timeZone: 'Europe/Stockholm' // Set Sweden's time zone
    };
    const formatter = new Intl.DateTimeFormat('sv-SE', dateOptions); // 'sv-SE' is the Swedish locale
    const formattedDate = formatter.format(date);

    return formattedDate;
}