import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromNumber = process.env.TWILIO_PHONE_NUMBER!;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error("Twilio credentials missing in .env");
}

const client = Twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string) => {
  return client.messages.create({
    body,
    from: fromNumber,
    to,
  });
};
