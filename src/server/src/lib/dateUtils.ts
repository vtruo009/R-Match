export const getDateString = (dateObject: Date) => {
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    const year = dateObject.getFullYear();
    return month + '/' + date + '/' + year;
};