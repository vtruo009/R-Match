import React from 'react';
import MUITable, { TableProps as MUITableProps } from '@material-ui/core/Table';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tableHead: {
            backgroundColor: theme.palette.primary.main,
        },
        tableCell: {
            color: 'white',
        },
    })
);

function Table({ columns, children, ...passthroughProps }: TableProps) {
    const classes = useStyles();
    return (
        <>
            <TableContainer component={Paper}>
                <MUITable {...passthroughProps}>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            {columns.map((column, index) =>
                                index === 0 ? (
                                    <TableCell
                                        align='justify'
                                        style={{ width: '75%' }}
                                        className={classes.tableCell}
                                    >
                                        {column}
                                    </TableCell>
                                ) : (
                                    <TableCell
                                        align='center'
                                        className={classes.tableCell}
                                    >
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
