import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { Button, Container } from '@material-ui/core';

export interface DocumentProps {
    name: JSX.Element | string,
    isDefault: boolean,
    dateAdded: string, //change to Date later
}

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    }
});

function createData(
    name: JSX.Element | string,
    isDefault: boolean,
    dateAdded: string
) : DocumentProps {
    return { name, isDefault, dateAdded };
};

const rows = [
    createData('Resume.pdf', true, '01/02/2021'),
    createData('Resume.pdf', true, '01/02/2021'),
    createData('Resume.pdf', true, '01/02/2021'),
    createData('Resume.pdf', true, '01/02/2021'),
    createData('Resume.pdf', true, '01/02/2021'),
];

function Documents() {
    const classes = useStyles();
    
    return (
        <div>
            <Typography variant='h4' style={{ marginBottom: 10 }}>
                Resumes
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead style={{ "backgroundColor": 'gainsboro'}}>
                        <TableRow >
                            <TableCell align='justify' style={{ width: '75%'}}>Name</TableCell>
                            <TableCell align='center'>Default</TableCell>
                            <TableCell align='center'>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map( (row, index) => (
                            <TableRow key={index}>
                                <TableCell >{row.name}</TableCell>
                                <TableCell align='center'><Checkbox color='primary'></Checkbox></TableCell>
                                <TableCell align='center' >{row.dateAdded}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant='h4' style={{ marginBottom: 10, marginTop: 100 }}>
                Transcripts
            </Typography>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead style={{ "backgroundColor": 'gainsboro'}}>
                        <TableRow >
                            <TableCell align='justify' style={{ width: '75%'}}>Name</TableCell>
                            <TableCell align='center'>Default</TableCell>
                            <TableCell align='center'>Date Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map( (row, index) => (
                            <TableRow key={index}>
                                <TableCell >{row.name}</TableCell>
                                <TableCell align='center'><Checkbox color='primary'></Checkbox></TableCell>
                                <TableCell align='center' >{row.dateAdded}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button style={{ float: 'right', marginTop: 100, marginBottom: 100, marginRight: 35 }} variant='contained' color='primary'>
                Add a Document
            </Button>
        </div>
    );
}

export default Documents;