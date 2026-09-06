"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  inquiry: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactInquiryAction(data: ContactFormData) {
  try {
    const validated = contactSchema.parse(data);

    // 1. Send notification to Cisco Chemical Sales Desk
    await resend.emails.send({
      from: "Cisco Chemical Desk <onboarding@resend.dev>",
      to: "admin@cisco.com",
      replyTo: validated.email,
      subject: `[B2B Inquiry] ${validated.inquiry.toUpperCase()} from ${validated.name} (${validated.company || "Individual"})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0; font-size: 20px;">New Enterprise Chemical Inquiry</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Received via Cisco Chemical Online Portal</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: bold;">Sender Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${validated.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${validated.email}" style="color: #10b981; text-decoration: none;">${validated.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Organization:</td>
              <td style="padding: 8px 0; color: #0f172a;">${validated.company || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Inquiry Category:</td>
              <td style="padding: 8px 0; color: #0f172a; text-transform: capitalize;">${validated.inquiry}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Message Content:</p>
            <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${validated.message}</p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
            Cisco Chemical Inc. B2B Industrial Materials & Manufacturing
          </div>
        </div>
      `,
    });

    // 2. Send Auto-Acknowledgement to prospective client
    await resend.emails.send({
      from: "Cisco Chemical Desk <onboarding@resend.dev>",
      to: validated.email,
      subject: "We received your inquiry - Cisco Chemical Inc.",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">Thank you for contacting Cisco Chemical</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Hello <b>${validated.name}</b>,
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            We have received your <b>${validated.inquiry}</b> inquiry. One of our technical chemical specialists will review your requirements and follow up within 24 business hours.
          </p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 13px; color: #475569;">
            <b>Summary of your message:</b><br/>
            <i>"${validated.message.slice(0, 160)}${validated.message.length > 160 ? "..." : ""}"</i>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
            Best regards,<br/>
            <b>Cisco Chemical Sales & Engineering Support Team</b>
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation failed" };
    }
    console.error("Error sending contact inquiry email:", error);
    return { error: "Failed to submit inquiry. Please try again or email us directly." };
  }
}
