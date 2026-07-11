import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  async sendEmail(to: string = '', subject: string, body: string) {
    const resend = new Resend(process.env.RESEND_API_Key);
    return await resend.emails.send({
      from: 'Filmam <noreply@filmamapp.ir>',
      to,
      subject,
      headers: {
        'Reply-To': 'filmamapp@gmail.com',
        'X-Google-Original-From': 'filmamapp@gmail.com',
      },
      html: body,
    });
  }
}
