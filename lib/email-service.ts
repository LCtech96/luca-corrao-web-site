import * as SibApiV3Sdk from '@sendinblue/client';

// Configurazione Brevo
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

// Template email di verifica
const VERIFICATION_EMAIL_TEMPLATE = {
  subject: "Verifica il tuo account - Luca Corrao",
  htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">Luca Corrao</h1>
        <p style="color: white; margin: 10px 0 0 0;">AI & Ospitalità Siciliana</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #374151; margin-bottom: 20px;">Verifica il tuo account</h2>
        
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
          Grazie per esserti registrato! Per completare la registrazione, inserisci il seguente codice di verifica:
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #f59e0b; letter-spacing: 4px;">{{CODE}}</span>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Questo codice scadrà tra 10 minuti. Se non hai richiesto questo codice, ignora questa email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © 2024 Luca Corrao. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  `,
  textContent: `
    Verifica il tuo account - Luca Corrao
    
    Grazie per esserti registrato! Per completare la registrazione, inserisci il seguente codice di verifica:
    
    {{CODE}}
    
    Questo codice scadrà tra 10 minuti. Se non hai richiesto questo codice, ignora questa email.
    
    © 2024 Luca Corrao. Tutti i diritti riservati.
  `
};

// Template email di reset password
const RESET_PASSWORD_EMAIL_TEMPLATE = {
  subject: "Reset Password - Luca Corrao",
  htmlContent: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">Luca Corrao</h1>
        <p style="color: white; margin: 10px 0 0 0;">AI & Ospitalità Siciliana</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #374151; margin-bottom: 20px;">Reset Password</h2>
        
        <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
          Hai richiesto il reset della password. Inserisci il seguente codice per procedere:
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #f59e0b; letter-spacing: 4px;">{{CODE}}</span>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Questo codice scadrà tra 10 minuti. Se non hai richiesto questo reset, ignora questa email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © 2024 Luca Corrao. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  `,
  textContent: `
    Reset Password - Luca Corrao
    
    Hai richiesto il reset della password. Inserisci il seguente codice per procedere:
    
    {{CODE}}
    
    Questo codice scadrà tra 10 minuti. Se non hai richiesto questo reset, ignora questa email.
    
    © 2024 Luca Corrao. Tutti i diritti riservati.
  `
};

export class EmailService {
  /**
   * Invia email di verifica
   */
  static async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = VERIFICATION_EMAIL_TEMPLATE.subject;
      sendSmtpEmail.htmlContent = VERIFICATION_EMAIL_TEMPLATE.htmlContent.replace('{{CODE}}', code);
      sendSmtpEmail.textContent = VERIFICATION_EMAIL_TEMPLATE.textContent.replace('{{CODE}}', code);
      sendSmtpEmail.sender = { name: "Luca Corrao", email: "noreply@lucacorrao.com" };
      sendSmtpEmail.to = [{ email }];
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email di verifica inviata:', result);
      return true;
    } catch (error) {
      console.error('Errore invio email di verifica:', error);
      return false;
    }
  }

  /**
   * Invia email di reset password
   */
  static async sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = RESET_PASSWORD_EMAIL_TEMPLATE.subject;
      sendSmtpEmail.htmlContent = RESET_PASSWORD_EMAIL_TEMPLATE.htmlContent.replace('{{CODE}}', code);
      sendSmtpEmail.textContent = RESET_PASSWORD_EMAIL_TEMPLATE.textContent.replace('{{CODE}}', code);
      sendSmtpEmail.sender = { name: "Luca Corrao", email: "noreply@lucacorrao.com" };
      sendSmtpEmail.to = [{ email }];
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email di reset password inviata:', result);
      return true;
    } catch (error) {
      console.error('Errore invio email di reset password:', error);
      return false;
    }
  }

  /**
   * Invia email di benvenuto
   */
  static async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = "Benvenuto - Luca Corrao";
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Luca Corrao</h1>
            <p style="color: white; margin: 10px 0 0 0;">AI & Ospitalità Siciliana</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Benvenuto!</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              Ciao ${firstName || 'utente'}! Grazie per esserti registrato al nostro servizio.
            </p>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 30px;">
              Ora puoi accedere alle nostre strutture ricettive e utilizzare i nostri servizi AI.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://lucacorrao.com" style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Vai al Sito
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © 2024 Luca Corrao. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      `;
      sendSmtpEmail.sender = { name: "Luca Corrao", email: "noreply@lucacorrao.com" };
      sendSmtpEmail.to = [{ email }];
      
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email di benvenuto inviata:', result);
      return true;
    } catch (error) {
      console.error('Errore invio email di benvenuto:', error);
      return false;
    }
  }
} 