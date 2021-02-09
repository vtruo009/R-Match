import React from 'react';
import Grid from '@material-ui/core/Grid';
import MUIPagination, {
    PaginationProps as MUIPaginationProps,
} from '@material-ui/lab/Pagination';

interface PaginationProps {
    onPageChange: () => void;
    numOfPages: number;
    page: number;
    setPage: (num: number) => void;
    setNumOfPages: (num: number) => void;
    scrollToTopAfterChange?: boolean;
}

function Pagination({
    onPageChange,
    page,
    setPage,
    numOfPages,
    title,
    scrollToTopAfterChange,
    ...passthroughProps
}: PaginationProps & MUIPaginationProps) {
    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        if (scrollToTopAfterChange) window.scrollTo(0, 0);
        setPage(newPage);
        onPageChange();
    };

    return numOfPages > 1 ? (
        <Grid container justify='center' style={{ marginTop: 50 }}>
            <MUIPagination
                color='primary'
                shape='rounded'
                page={page}
                count={numOfPages}
                onChange={handlePageChange}
                {...passthroughProps}
            />
        </Grid>
    ) : (
        <> </>
    );
}

type usePaginationReturn = {
    page: number;
    setPage: (num: number) => void;
    numOfPages: number;
    setNumOfPages: (num: number) => void;
    PaginationProps: PaginationProps;
    Pagination: any;
};

export default function usePagination(): usePaginationReturn {
    const [page, setPage] = React.useState(1);
    const [numOfPages, setNumOfPages] = React.useState(0);

    const PaginationProps: PaginationProps = {
        page,
        numOfPages,
        setNumOfPages,
        setPage,
        onPageChange: () => {},
        scrollToTopAfterChange: true,
    };

    return {
        page,
        setPage,
        numOfPages,
        setNumOfPages,
        PaginationProps,
        Pagination,
    };
}
