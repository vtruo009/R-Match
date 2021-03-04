import nodemailer from 'nodemailer';
import logger from '@shared/Logger';

const rRatchEmailAddress = 'rmatch.jmsv@gmail.com'

const transporter = nodemailer.createTransport(
    `smtps://rmatch.jmsv%40gmail.com:ucrcs178winter2021@smtp.gmail.com`
);

/**
 * @description Send an email to the specified email address.
 * @param {string} email - Receiver email address
 * @param {string} subject - Email subject
 * @param {string} text - Email text
 * @returns Promise
 */
export const sendEmail = async (
    email: string,
    subject: string,
    text: string
) => {
    const mailOptions = {
        from: rRatchEmailAddress,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return logger.err(error)
        logger.info('Message sent: ' + info.response);
    });
};