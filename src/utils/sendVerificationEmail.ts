import { getUserCollection } from "@/lib/database/db_collections";
import { generateRandomToken } from "./generateRandomToken";
import { sendEmail } from "./sendEmail";

export const sendVerificationEmail = async (userEmail: string, userName: string) => {
  const usersCollection = await getUserCollection();

  // Generate a new token
  const emailVerificationToken = generateRandomToken(10);

  // Update the user document with the token
  await usersCollection.updateOne(
    { email: userEmail },
    { $set: { emailVerificationToken, verified: false } }
  );

  // Build verification link
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${emailVerificationToken}&userEmail=${userEmail}`;

  // Email HTML
  const htmlContent = `
    <h3>Hello ${userName},</h3>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#4caf50;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
    <p>If you did not create an account, you can ignore this email.</p>
  `;

  // Send email
  await sendEmail(userEmail, "Verify your email", htmlContent);
};
