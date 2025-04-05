
import { useState } from "react";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { Email } from "../components/email"; // Import the Email component

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendEmail = async ({ to, subject, content }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Render the email template with dynamic content
      const emailHtml = await render(<Email content={content} />);

      // Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.forwardemail.net",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, // Use env variables for security
          pass: process.env.EMAIL_PASS,
        },
      });

      // Email options
      const options = {
        from: "you@example.com",
        to, // use the emails from the csv file. Make a loop
        subject, // take it from the object recived from the blocknote.jsx
        html: emailHtml, // use the template string made in the blockNote.jsx
      };

      // Send email
      await transporter.sendMail(options);
      setSuccess("Email sent successfully!");
    } catch (err) {
      setError("Failed to send email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error, success };
};

export default useSendEmail;

