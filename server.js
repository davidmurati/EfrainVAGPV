const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

// Load .env for local development (Vercel uses its own env vars dashboard)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from imagenes folder
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// ── Email configuration ──────────────────────────────────────────────────────
// LOCAL:  create a .env file in this folder with:
//         EMAIL_USER=tu_correo@gmail.com
//         EMAIL_PASS=tu_contraseña_de_aplicacion_gmail
// VERCEL: add EMAIL_USER and EMAIL_PASS in:
//         Vercel Dashboard → Project → Settings → Environment Variables
// ─────────────────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

// ── POST /api/contacto ────────────────────────────────────────────────────────
app.post('/api/contacto', async (req, res) => {
  const { nombre, empresa, email, telefono, asunto, mensaje } = req.body;

  // Basic validation
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ ok: false, error: 'Nombre, email y mensaje son requeridos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ ok: false, error: 'Correo electrónico inválido.' });
  }

  // If no credentials configured, log and return success (dev mode)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📩 [DEV] Consulta recibida (configura EMAIL_USER y EMAIL_PASS para enviar correo):');
    console.log({ nombre, empresa, email, telefono, asunto, mensaje });
    return res.json({ ok: true, dev: true });
  }

  const mailOptions = {
    from: `"AGPV Web" <${process.env.EMAIL_USER}>`,
    to: 'velazquez@agpvasesores.com',
    replyTo: email,
    subject: `[Consulta Web] ${asunto || 'Sin asunto'} — ${nombre}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <div style="background:#0a0a0a;padding:24px;border-radius:8px 8px 0 0;">
          <h2 style="color:#f97316;margin:0;">Nueva Consulta — AGPV Asesores Económicos</h2>
        </div>
        <div style="background:#f8f8f8;padding:24px;border:1px solid #e5e5e5;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#737373;width:130px;vertical-align:top;"><strong>Nombre</strong></td><td style="padding:8px 0;">${nombre}</td></tr>
            ${empresa ? `<tr><td style="padding:8px 0;color:#737373;vertical-align:top;"><strong>Empresa</strong></td><td style="padding:8px 0;">${empresa}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#737373;vertical-align:top;"><strong>Correo</strong></td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#f97316;">${email}</a></td></tr>
            ${telefono ? `<tr><td style="padding:8px 0;color:#737373;vertical-align:top;"><strong>Teléfono</strong></td><td style="padding:8px 0;">${telefono}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#737373;vertical-align:top;"><strong>Asunto</strong></td><td style="padding:8px 0;">${asunto || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;"/>
          <p style="color:#737373;margin:0 0 8px;"><strong>Mensaje:</strong></p>
          <p style="color:#111;white-space:pre-line;margin:0;">${mensaje}</p>
        </div>
        <div style="background:#0a0a0a;padding:12px 24px;border-radius:0 0 8px 8px;">
          <p style="color:#525252;font-size:12px;margin:0;">Enviado desde el formulario de agpvasesores.com</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado desde ${email}`);
    res.json({ ok: true });
  } catch (err) {
    console.error('❌ Error enviando correo:', err.message);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el correo. Intente más tarde.' });
  }
});

// ── Main route ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start server locally — Vercel imports this file as a module ───────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor AGPV corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
