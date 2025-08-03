import { Twilio } from "twilio";
import { SMSParams } from "../types";

const sendSMS = async (smsParams: SMSParams, env: Env) => {
    const { name, phone, smsMessage } = smsParams;
    const CHANNEL = "sms";

    if (!name || !phone || !smsMessage) {
        throw new Error("Missing name or phone or text");
    }

    console.log("Sending SMS to: " + phone);
    console.log("Sending SMS to: " + name);
    console.log("Sending SMS Text: " + smsMessage);

    try {
        const twilio = new Twilio(
            env.TWILIO_ACCOUNT_SID,
            env.TWILIO_AUTH_TOKEN
        );

        const message = await twilio.verify.v2
            .services(env.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create({
                to: phone,
                channel: CHANNEL,
            });

        console.log("Message sent:", message);
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw new Error("Error sending SMS");
    }
};

export { sendSMS };
