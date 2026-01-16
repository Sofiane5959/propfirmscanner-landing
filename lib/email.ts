import nodemailer from 'nodemailer';

// Zoho SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"PropFirmScanner" <${process.env.ZOHO_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

// Alert Types
export type AlertType = 
  | 'drawdown_warning'
  | 'drawdown_critical'
  | 'profit_target_reached'
  | 'challenge_expiring'
  | 'daily_loss_warning';

export interface AlertData {
  userName: string;
  accountName: string;
  firmName: string;
  currentValue: number;
  limitValue: number;
  percentage: number;
  daysRemaining?: number;
}

export async function sendAlert(
  type: AlertType,
  to: string,
  data: AlertData
) {
  const template = getEmailTemplate(type, data);
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  });
}

function getEmailTemplate(type: AlertType, data: AlertData) {
  const templates: Record<AlertType, { subject: string; html: string }> = {
    drawdown_warning: {
      subject: `⚠️ Alerte Drawdown: ${data.accountName} à ${data.percentage.toFixed(1)}%`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #030712; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://propfirmscanner.org/icons/icon-96.png" alt="PropFirmScanner" style="width: 60px; height: 60px;">
          </div>
          
          <div style="background: linear-gradient(135deg, #f59e0b20, #f59e0b10); border: 1px solid #f59e0b; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #f59e0b; margin: 0 0 10px 0; font-size: 24px;">⚠️ Alerte Drawdown</h1>
            <p style="color: #9ca3af; margin: 0;">Attention requise sur votre compte</p>
          </div>

          <p style="color: #e5e7eb; font-size: 16px;">Bonjour ${data.userName},</p>
          
          <p style="color: #e5e7eb; font-size: 16px;">
            Votre compte <strong style="color: #10b981;">${data.accountName}</strong> chez 
            <strong>${data.firmName}</strong> approche de la limite de drawdown.
          </p>

          <div style="background: #111827; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #9ca3af;">Drawdown actuel</td>
                <td style="color: #f59e0b; font-weight: bold; font-size: 20px; text-align: right;">${data.currentValue.toFixed(2)}$</td>
              </tr>
              <tr>
                <td style="color: #9ca3af;">Limite maximale</td>
                <td style="color: #e5e7eb; font-weight: bold; text-align: right;">${data.limitValue.toFixed(2)}$</td>
              </tr>
            </table>
            <div style="background: #1f2937; border-radius: 8px; height: 12px; overflow: hidden; margin-top: 15px;">
              <div style="background: linear-gradient(90deg, #10b981, #f59e0b); width: ${data.percentage}%; height: 100%;"></div>
            </div>
            <p style="text-align: center; color: #f59e0b; font-size: 18px; margin-top: 10px; font-weight: bold;">
              ${data.percentage.toFixed(1)}% utilisé
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://propfirmscanner.org/dashboard" 
               style="background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Voir mon Dashboard →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
            PropFirmScanner - Track Your Challenge<br>
            <a href="https://propfirmscanner.org/settings" style="color: #10b981;">Gérer mes notifications</a>
          </p>
        </div>
      `,
    },

    drawdown_critical: {
      subject: `🚨 URGENT: ${data.accountName} à ${data.percentage.toFixed(1)}% du drawdown!`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #030712; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://propfirmscanner.org/icons/icon-96.png" alt="PropFirmScanner" style="width: 60px; height: 60px;">
          </div>
          
          <div style="background: linear-gradient(135deg, #ef444420, #ef444410); border: 1px solid #ef4444; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #ef4444; margin: 0 0 10px 0; font-size: 24px;">🚨 ALERTE CRITIQUE</h1>
            <p style="color: #9ca3af; margin: 0;">Action immédiate requise!</p>
          </div>

          <p style="color: #e5e7eb; font-size: 16px;">Bonjour ${data.userName},</p>
          
          <p style="color: #e5e7eb; font-size: 16px;">
            <strong style="color: #ef4444;">ATTENTION:</strong> Votre compte 
            <strong style="color: #10b981;">${data.accountName}</strong> est très proche de la limite de drawdown!
          </p>

          <div style="background: #111827; border: 2px solid #ef4444; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
            <span style="color: #ef4444; font-size: 48px; font-weight: bold;">${data.percentage.toFixed(1)}%</span>
            <p style="color: #9ca3af; margin: 5px 0 0 0;">du drawdown maximum atteint</p>
            <div style="background: #1f2937; border-radius: 8px; height: 16px; overflow: hidden; margin-top: 20px;">
              <div style="background: linear-gradient(90deg, #ef4444, #dc2626); width: ${data.percentage}%; height: 100%;"></div>
            </div>
            <p style="color: #ef4444; margin-top: 15px;">
              Il vous reste <strong>${(data.limitValue - data.currentValue).toFixed(2)}$</strong> avant la limite
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://propfirmscanner.org/dashboard" 
               style="background: #ef4444; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Voir mon Dashboard MAINTENANT →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
            PropFirmScanner - Track Your Challenge
          </p>
        </div>
      `,
    },

    profit_target_reached: {
      subject: `🎉 Félicitations! Objectif atteint sur ${data.accountName}!`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #030712; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://propfirmscanner.org/icons/icon-96.png" alt="PropFirmScanner" style="width: 60px; height: 60px;">
          </div>
          
          <div style="background: linear-gradient(135deg, #10b98120, #10b98110); border: 1px solid #10b981; border-radius: 12px; padding: 30px; margin-bottom: 20px; text-align: center;">
            <h1 style="color: #10b981; margin: 0 0 10px 0; font-size: 32px;">🎉 FÉLICITATIONS!</h1>
            <p style="color: #9ca3af; margin: 0;">Vous avez atteint votre objectif!</p>
          </div>

          <p style="color: #e5e7eb; font-size: 16px;">Bonjour ${data.userName},</p>
          
          <p style="color: #e5e7eb; font-size: 16px;">
            Excellent travail! Votre compte <strong style="color: #10b981;">${data.accountName}</strong> 
            chez <strong>${data.firmName}</strong> a atteint l'objectif de profit!
          </p>

          <div style="background: #111827; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
            <span style="color: #10b981; font-size: 48px; font-weight: bold;">+${data.currentValue.toFixed(2)}$</span>
            <p style="color: #9ca3af; margin: 10px 0 0 0;">Profit réalisé</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://propfirmscanner.org/dashboard" 
               style="background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Voir mon Dashboard →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
            PropFirmScanner - Track Your Challenge
          </p>
        </div>
      `,
    },

    challenge_expiring: {
      subject: `⏰ ${data.daysRemaining} jours restants pour ${data.accountName}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #030712; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://propfirmscanner.org/icons/icon-96.png" alt="PropFirmScanner" style="width: 60px; height: 60px;">
          </div>
          
          <div style="background: linear-gradient(135deg, #8b5cf620, #8b5cf610); border: 1px solid #8b5cf6; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #8b5cf6; margin: 0 0 10px 0; font-size: 24px;">⏰ Rappel Challenge</h1>
            <p style="color: #9ca3af; margin: 0;">Votre challenge arrive à expiration</p>
          </div>

          <p style="color: #e5e7eb; font-size: 16px;">Bonjour ${data.userName},</p>
          
          <p style="color: #e5e7eb; font-size: 16px;">
            Votre challenge <strong style="color: #10b981;">${data.accountName}</strong> expire bientôt!
          </p>

          <div style="background: #111827; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
            <span style="color: #8b5cf6; font-size: 64px; font-weight: bold;">${data.daysRemaining}</span>
            <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 18px;">jours restants</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://propfirmscanner.org/dashboard" 
               style="background: #8b5cf6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Voir mon Dashboard →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
            PropFirmScanner - Track Your Challenge
          </p>
        </div>
      `,
    },

    daily_loss_warning: {
      subject: `⚠️ Limite de perte journalière: ${data.accountName} à ${data.percentage.toFixed(1)}%`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #030712; color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://propfirmscanner.org/icons/icon-96.png" alt="PropFirmScanner" style="width: 60px; height: 60px;">
          </div>
          
          <div style="background: linear-gradient(135deg, #f59e0b20, #f59e0b10); border: 1px solid #f59e0b; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
            <h1 style="color: #f59e0b; margin: 0 0 10px 0; font-size: 24px;">⚠️ Perte Journalière</h1>
            <p style="color: #9ca3af; margin: 0;">Limite quotidienne approchée</p>
          </div>

          <p style="color: #e5e7eb; font-size: 16px;">Bonjour ${data.userName},</p>
          
          <p style="color: #e5e7eb; font-size: 16px;">
            Votre compte <strong style="color: #10b981;">${data.accountName}</strong> approche de la limite de perte journalière.
          </p>

          <div style="background: #111827; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <p style="color: #9ca3af; margin: 0 0 10px 0;">Perte du jour</p>
            <p style="color: #f59e0b; font-size: 32px; font-weight: bold; margin: 0;">
              -${data.currentValue.toFixed(2)}$ / -${data.limitValue.toFixed(2)}$
            </p>
            <div style="background: #1f2937; border-radius: 8px; height: 12px; overflow: hidden; margin-top: 15px;">
              <div style="background: #f59e0b; width: ${data.percentage}%; height: 100%;"></div>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://propfirmscanner.org/dashboard" 
               style="background: #f59e0b; color: black; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Voir mon Dashboard →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
            PropFirmScanner - Track Your Challenge
          </p>
        </div>
      `,
    },
  };

  return templates[type];
}
