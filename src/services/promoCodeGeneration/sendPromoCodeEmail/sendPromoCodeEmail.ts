import nodemailer from 'nodemailer';
const sendPromoCodeEmail = async (email: string, code: string, discountType: string, discountValue:number, expirationDate: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER as string,
        to: email,
        subject: 'Your Promo Code',
        text: `Here is your promo code: ${code}\nType: ${discountType}\nValue: ${discountValue}\nExpires on: ${expirationDate}`,
    };
    await transporter.sendMail(mailOptions);
};

export default sendPromoCodeEmail;