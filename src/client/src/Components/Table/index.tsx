import React from 'react';
import MUITable, { TableProps as MUITableProps } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface TableProps extends MUITableProps {
    columns: string[];
    children: JSX.Element;
}

function Table({ columns, children, ...passthroughProps }: TableProps) {
    return (
        <>
            <TableContainer component={Paper}>
                <MUITable {...passthroughProps}>
                    <TableHead style={{ backgroundColor: 'gainsboro' }}>
                        <TableRow>
                            {columns.map((column, index) =>
                                index === 0 ? (
                                    <TableCell
                                        align='justify'
                                        style={{ width: '75%' }}
                                    >
                                        {column}
                                    </TableCell>
                                ) : (
                                    <TableCell align='center'>
                                        {column}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>{children}</TableBody>
                </MUITable>
            </TableContainer>
        </>
    );
}

export default Table;
