import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationCode = async (toEmail, code) => {
  await transporter.sendMail({
    from: `"SleepSync" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Kode Verifikasi Reset Password - SleepSync",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1a1a2e;margin-bottom:8px">🌙 SleepSync</h2>
        <p style="color:#6b7280;margin-bottom:24px">Reset Password</p>
        <p style="color:#374151">Gunakan kode verifikasi berikut untuk mereset password Anda:</p>
        <div style="background:#f3f4f6;border-radius:8px;padding:20px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1a1a2e">${code}</span>
        </div>
        <p style="color:#6b7280;font-size:14px">Kode ini berlaku selama <strong>10 menit</strong>.</p>
        <p style="color:#6b7280;font-size:14px">Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:12px;text-align:center">SleepSync — Pantau pola tidur Anda</p>
      </div>
    `,
  });
};