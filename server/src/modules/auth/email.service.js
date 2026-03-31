import SibApiV3Sdk from "sib-api-v3-sdk";
import { env } from "../../config/env.js";
import ApiError from "../../utils/ApiError.js";

const client = SibApiV3Sdk.ApiClient.instance;

if (env.NODE_ENV !== "test") {
  client.authentications["api-key"].apiKey = env.BREVO_API_KEY;
}

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTPEmail = async (email, otp, type = "verify") => {
  if (env.NODE_ENV === "test") return;

  const isVerify = type === "verify";

  const subject = isVerify
    ? "Verify your email - AI SHIKSHAK"
    : "Reset your password - AI SHIKSHAK";

  const heading = isVerify
    ? "Email Verification"
    : "Password Reset";

  const description = isVerify
    ? "Use the OTP below to verify your email address."
    : "Use the OTP below to reset your password.";

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:500px;margin:auto;background:#fff;padding:30px;border-radius:10px;text-align:center;">
      
      <h2>${heading}</h2>
      <p>${description}</p>

      <div style="margin:20px 0;">
        <span style="font-size:24px;letter-spacing:5px;font-weight:bold;background:#eee;padding:10px 20px;border-radius:8px;">
          ${otp}
        </span>
      </div>

      <p style="font-size:12px;color:#888;">
        Expires in ${env.OTP_EXPIRE_MINUTES} minutes
      </p>

      <hr/>

      <p style="font-size:12px;color:#aaa;">
        If you didn’t request this, ignore this email.
      </p>

    </div>
  </div>
  `;

  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: env.EMAIL_FROM,
        name: "AI SHIKSHAK",
      },
      to: [{ email }],
      subject,
      htmlContent: html,
    });

    console.log(`OTP email sent via Brevo API to ${email}`);
  } catch (err) {
    console.error("BREVO EMAIL ERROR:", err);

    throw new ApiError(500, "Failed to send OTP email");
  }
};