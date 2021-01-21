import React from 'react';
import Typography from '@material-ui/core/Typography';

interface SalaryProps {
    minSalary: number;
    maxSalary?: number;
}

function Salary({ minSalary, maxSalary }: SalaryProps) {
    const isMaxSalaryValid = () => {
        if (!maxSalary) {
            return false;
        }
        return maxSalary > minSalary;
    };

    return (
        <Typography>
            ${minSalary}
            {isMaxSalaryValid() && <> - ${maxSalary}</>}
        </Typography>
    );
}

export default Salary;
