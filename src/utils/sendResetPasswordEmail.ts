import { getUserCollection } from "@/lib/database/db_collections";
import { generateRandomToken } from "./generateRandomToken";
import { sendEmail } from "./sendEmail";

export const sendResetPasswordEmail = async (userEmail: string, userName: string) => {
  const usersCollection = await getUserCollection();

  // Generate token + expiry
  const resetPasswordToken = generateRandomToken(32);
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 15).toISOString(); // 15 min

  // Save token + expiry to user
  await usersCollection.updateOne(
    { email: userEmail },
    { 
      $set: { 
        emailVerificationToken: resetPasswordToken, 
        tokenExpires: tokenExpiry 
      } 
    }
  );

  // Reset link
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetPasswordToken}&userEmail=${userEmail}`;

  // Email template
  const htmlContent = `
    <h3>Hello ${userName},</h3>
    <p>You requested to reset your password. Please click the link below to set a new password:</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#1976d2;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>This link will expire in 15 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

 await sendEmail(userEmail, "Reset your password", htmlContent);
//  console.log(res,"reset email res");
};
