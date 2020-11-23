import React from 'react';
import Typography from '@material-ui/core/Typography';
interface props {
    minSalary: number;
    maxSalary?: number;
}

function SalaryDisplayer({ minSalary, maxSalary }: props) {
    const isMaxSalaryValid = () => {
        if (!maxSalary) {
            return false;
        }
        return maxSalary > minSalary;
    };

    return (
        <Typography>
            xd
            ${minSalary}
            {isMaxSalaryValid() && <> - ${maxSalary}</>}
        </Typography>
    );
}

export default SalaryDisplayer;
