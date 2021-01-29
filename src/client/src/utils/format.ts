import { format } from 'date-fns';

export function formatDateString(date?: string, formatString = 'MM/dd/yyyy') {
    if (!date) return '';
    let _date = new Date(date);
    // Adds one date to it because js new Date() returns a day before
    _date.setDate(_date.getDate() + 1);
    return format(_date, formatString);
}

export function formatSalary(minSalary: number, maxSalary?: number) {
    const isMaxSalaryValid = () => {
        if (!maxSalary) return false;
        return maxSalary > minSalary;
    };
    return `$${minSalary}${isMaxSalaryValid() ? ' - $' + maxSalary : ''}`;
}

export function formatDateStringBasedOnCurrentDay(date: string) {
    const requestedDate = new Date(date);
    const dateNow = new Date();

    // If the requested date is today, return time.
    if (requestedDate.getMonth() === dateNow.getMonth()
        && requestedDate.getDate() === dateNow.getDate()
        && requestedDate.getFullYear() === dateNow.getFullYear()) {
        var hour = requestedDate.getHours();
        var abbreviation = 'am';
        if (hour >= 12) {
            if (hour > 12) hour -= 12;
            abbreviation = 'pm';
        }
        return `${hour}:${requestedDate.getMinutes().toString().padStart(2, '0')} ${abbreviation}`;
    }

    // If the requested date is the same year, return only month and date.
    if (requestedDate.getFullYear() === dateNow.getFullYear())
        return `${requestedDate.getMonth() + 1}/${requestedDate.getDate()}`;

    // Else, return month, date, and year.
    return `${requestedDate.getMonth() + 1}/${requestedDate.getDate()}/${requestedDate.getFullYear()}`;
}
