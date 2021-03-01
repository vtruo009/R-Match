import React from 'react';
import Typography from '@material-ui/core/Typography';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Button from 'Components/Button';

interface ReadMoreOrLessProps {
    content: string;
    charLimit: number;
}

function ReadMoreOrLess({ content, charLimit }: ReadMoreOrLessProps) {
    const reducedContent = React.useCallback(
        () => content.substr(0, charLimit) + '...',
        [content, charLimit]
    );
    const [modifiedContent, setModifiedContent] = React.useState(
        reducedContent()
    );
    const [showMore, setShowMore] = React.useState(false);

    const readMore = () => {
        setModifiedContent(content);
        setShowMore(true);
    };

    const readLess = () => {
        setModifiedContent(reducedContent());
        setShowMore(false);
    };

    React.useEffect(() => {
        setShowMore(false);
        setModifiedContent(reducedContent());
    }, [reducedContent]);

    if (content.length < charLimit)
        return <Typography variant='body1'>{content}</Typography>;

    return (
        <Typography variant='body1'>
            {modifiedContent}{' '}
            {showMore ? (
                <Button
                    variant='text'
                    onClick={() => readLess()}
                    endIcon={<ArrowUpIcon />}
                >
                    Read less
                </Button>
            ) : (
                <Button
                    variant='text'
                    onClick={() => readMore()}
                    endIcon={<ArrowDownIcon />}
                >
                    Read more
                </Button>
            )}
        </Typography>
    );
}

export default ReadMoreOrLess;
