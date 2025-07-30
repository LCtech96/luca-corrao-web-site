import nodemailer from 'nodemailer'

// Configurazione del transporter email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
})

// Genera codice di verifica di 5 cifre
export function generateVerificationCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

// Invia email di verifica
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Verifica Registrazione - Luca Corrao',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Luca Corrao</h1>
            <p style="color: white; margin: 10px 0 0 0;">Verifica la tua registrazione</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Benvenuto!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Grazie per esserti registrato. Per completare la registrazione, 
              inserisci il seguente codice di verifica:
            </p>
            
            <div style="background: #fff; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #f59e0b; font-size: 32px; letter-spacing: 5px; margin: 0; font-weight: bold;">
                ${code}
              </h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Questo codice è valido per 10 minuti. Se non hai richiesto questa registrazione, 
              puoi ignorare questa email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Luca Corrao - Innovazione AI & Ospitalità Siciliana</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Errore nell\'invio email:', error)
    return false
  }
}

// Invia email di recupero password
export async function sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Recupero Password - Luca Corrao',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Luca Corrao</h1>
            <p style="color: white; margin: 10px 0 0 0;">Recupero Password</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Recupero Password</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Hai richiesto il recupero della password. Inserisci il seguente codice 
              per reimpostare la tua password:
            </p>
            
            <div style="background: #fff; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #f59e0b; font-size: 32px; letter-spacing: 5px; margin: 0; font-weight: bold;">
                ${code}
              </h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Questo codice è valido per 10 minuti. Se non hai richiesto il recupero password, 
              puoi ignorare questa email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 Luca Corrao - Innovazione AI & Ospitalità Siciliana</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Errore nell\'invio email di recupero:', error)
    return false
  }
} 