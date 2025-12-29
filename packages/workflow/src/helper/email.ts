import { Resend } from "resend";
import { EmailParams } from "../types";

const sendEmail = async (
    { email, name, subject, emailMessage }: EmailParams,
    env: CloudflareBindings
) => {
    const resend = new Resend(env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: subject ?? `Test Email For ${name}`,
        // html: text,  
        text: emailMessage ?? `This is the email body for ${name}`,
    });

    if (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }

    console.log("Email sent:", data);
    return data;
};

export { sendEmail };
