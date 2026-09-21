import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { mailConfig } from 'src/config/mail.config';
import { EmailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mailConfig,
    }),
  ],
  providers: [EmailService],
})
export class MailModule {}
