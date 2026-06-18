import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateName?: string;
  templateData?: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.from = configService.get('SMTP_FROM', 'noreply@omniforge.ai');
    this.isEnabled = !!configService.get('SMTP_HOST');
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isEnabled) {
      this.logger.warn(
        `Email disabled. Would send to ${options.to}: ${options.subject}`,
      );
      return false;
    }

    try {
      // TODO: Implement actual SMTP sending using nodemailer or similar
      // For now, just log that we would send
      this.logger.log(`Sending email to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      return false;
    }
  }

  async sendEmailVerification(
    email: string,
    verificationLink: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Verify your OmniForge AI email',
      html: this.getEmailVerificationTemplate(verificationLink),
      templateName: 'email-verification',
      templateData: { verificationLink },
    });
  }

  async sendPasswordReset(
    email: string,
    resetLink: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Reset your OmniForge AI password',
      html: this.getPasswordResetTemplate(resetLink),
      templateName: 'password-reset',
      templateData: { resetLink },
    });
  }

  async sendInvitation(
    email: string,
    organizationName: string,
    invitationLink: string,
    invitedByName: string,
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `You're invited to ${organizationName} on OmniForge AI`,
      html: this.getInvitationTemplate(
        organizationName,
        invitationLink,
        invitedByName,
      ),
      templateName: 'invitation',
      templateData: {
        organizationName,
        invitationLink,
        invitedByName,
      },
    });
  }

  async sendWelcome(email: string, firstName: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to OmniForge AI',
      html: this.getWelcomeTemplate(firstName),
      templateName: 'welcome',
      templateData: { firstName },
    });
  }

  private getEmailVerificationTemplate(verificationLink: string): string {
    return `
      <h2>Verify Your Email</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `;
  }

  private getPasswordResetTemplate(resetLink: string): string {
    return `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
  }

  private getInvitationTemplate(
    organizationName: string,
    invitationLink: string,
    invitedByName: string,
  ): string {
    return `
      <h2>You're invited to ${organizationName}</h2>
      <p>${invitedByName} has invited you to join ${organizationName} on OmniForge AI.</p>
      <a href="${invitationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
        Accept Invitation
      </a>
      <p>This invitation expires in 7 days.</p>
    `;
  }

  private getWelcomeTemplate(firstName: string): string {
    return `
      <h2>Welcome to OmniForge AI, ${firstName}!</h2>
      <p>We're excited to have you on board.</p>
      <p>OmniForge AI is your one creative operating system for every modality. Get started by:</p>
      <ul>
        <li>Creating your first workspace</li>
        <li>Uploading assets to your library</li>
        <li>Exploring our creative studios</li>
      </ul>
      <p>Need help? Check out our <a href="https://docs.omniforge.ai">documentation</a>.</p>
    `;
  }
}
