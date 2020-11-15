import { format } from 'date-fns';

export function formatDate(
    date: Date | string | number,
    formatString = 'MM/dd/yyyy'
) {
    if (typeof date === 'string') date = new Date(date);
    return format(date, formatString);
}
