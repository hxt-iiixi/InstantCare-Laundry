// backend/controllers/memberController.js
import ChurchApplication from "../models/ChurchApplication.js";
import { sendTransactionalEmail } from "../utils/mailer.js";

const escapeHtml = (s = "") =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const sendMemberContact = async (req, res) => {
  try {
    const rawSubject = (req.body?.subject || "Inquiry from parish member").toString();
    const rawMessage = (req.body?.message || "").toString();
    let { churchId } = req.body;

    // figure out the church id
    if (!churchId && req.user?.role === "member" && req.user?.churchRef) {
      churchId = String(req.user.churchRef);
    }
    if (!churchId && ["church-admin", "admin", "superadmin"].includes(req.user?.role || "")) {
      const mine = await ChurchApplication.findOne({ email: (req.user.email || "").toLowerCase() })
        .select("_id")
        .lean();
      if (mine?._id) churchId = String(mine._id);
    }
    if (!churchId) return res.status(400).json({ message: "No church linked to your account." });

    // get church admin email
    const app = await ChurchApplication.findById(churchId).select("churchName email").lean();
    if (!app?.email) return res.status(404).json({ message: "Church email not found." });

    const senderName = req.user?.name || req.user?.username || req.user?.email || "Parish Member";
    const senderEmail = req.user?.email || process.env.SMTP_USER;

    const subject = rawSubject.slice(0, 200);
    const message = rawMessage.slice(0, 5000);

    await sendTransactionalEmail({
      to: app.email,
      replyTo: senderEmail,
      subject,
      text:
        `From: ${senderName}\n` +
        `Email: ${senderEmail}\n` +
        `Church: ${app.churchName}\n\n` +
        message,
      html:
        `<p><strong>From:</strong> ${escapeHtml(senderName)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>` +
        `<p><strong>Church:</strong> ${escapeHtml(app.churchName || "")}</p>` +
        `<hr/>` +
        `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>`,
    });

    res.json({ ok: true, to: app.email });
  } catch (e) {
    console.error("sendMemberContact error:", e);
    res.status(500).json({ message: "Failed to send email." });
  }
};
