export const emailHtml = (otp: string, name?: string) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial;">
      <div style="max-width:500px;margin:40px auto;background:#fff;padding:40px;border-radius:16px;text-align:center;">

        <h2 style="color:#111827;">Verify your email</h2>

        <p style="color:#6b7280;font-size:14px;">
          ${name ? `Hey ${name},` : "Hey,"} use this code to continue.
        </p>

        <div style="
          margin:30px auto;
          padding:15px 25px;
          background:#111827;
          display:inline-block;
          border-radius:10px;
        ">
          <span style="
            font-size:32px;
            letter-spacing:6px;
            color:#fff;
            font-weight:bold;
          ">
            ${otp}
          </span>
        </div>

        <p style="color:#6b7280;font-size:13px;">
          This code expires in 10 minutes.
        </p>

        <p style="color:#9ca3af;font-size:12px;margin-top:30px;">
          If you didn’t request this, ignore it.
        </p>

      </div>
    </body>
  </html>
  `;
};