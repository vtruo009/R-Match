import React from 'react';
import Typography from '@material-ui/core/Typography';
interface props {
    minSalary: number;
    maxSalary?: number;
}

function SalaryDisplayer({ minSalary, maxSalary }: props) {
    return (
        <Typography>
            ${minSalary}
            {maxSalary && <> - ${maxSalary}</>}
        </Typography>
    );
}

export default SalaryDisplayer;
