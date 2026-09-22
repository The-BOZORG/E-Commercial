import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailer: MailerService) {}

  async sendVerificationEmail(
    email: string,
    firstName: string,
    verificationUrl: string,
  ): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verification',
      context: {
        firstName,
        verificationUrl,
      },
    });
  }
}
