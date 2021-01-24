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
