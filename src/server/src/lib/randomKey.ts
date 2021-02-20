export const makeRandomString = (
    length: number,
) => {
    var randomString: string = '';
    const letters: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {

        randomString += letters.charAt(Math.floor(Math.random() * letters.length));

    }
    return randomString;
}