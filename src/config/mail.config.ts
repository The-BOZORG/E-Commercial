import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';

export function mailConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('smtp.host'),
      port: 587,
      secure: false,
      auth: {
        user: configService.getOrThrow<string>('smtp.username'),
        pass: configService.getOrThrow<string>('smtp.password'),
      },
    },
    defaults: {
      from: 'TEST <no-reply@nestjs.com>',
    },
    template: {
      dir: join(__dirname, '..', 'mail', 'template'),
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  };
}
