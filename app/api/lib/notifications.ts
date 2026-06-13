// Owner notification templates + dispatcher for new orders and reservations.
//
// Templates are ready now. Actual sending is OFF until channels are configured
// via env vars (no code change needed to enable):
//   Email (Resend):  RESEND_API_KEY, NOTIFY_EMAIL_FROM, NOTIFY_EMAIL_TO
//   WhatsApp (Twilio): TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
//                      TWILIO_WHATSAPP_FROM, NOTIFY_WHATSAPP_TO
// Until then, the rendered messages are logged (visible in `railway logs`).

const RESTAURANT = "Aura Curry House Cafe";

export type DeliveryType = "pickup" | "delivery" | "dineIn";

export interface OrderNotification {
  id: number;
  customerName: string;
  customerMobile: string;
  customerAddress?: string | null;
  deliveryType: DeliveryType;
  notes?: string | null;
  items: Array<{ name: string; price: number; quantity: number }>;
  subtotal: string;
  tax: string;
  total: string;
}

export interface ReservationNotification {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string | null;
}

const ORDER_TYPE_LABEL: Record<DeliveryType, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
  dineIn: "Dine-In",
};

const money = (v: string | number) => `$${Number(v).toFixed(2)}`;

interface RenderedMessage {
  subject: string;
  text: string; // plain text (also used as email fallback / WhatsApp body)
  html: string; // email HTML
}

// ── Email shell ─────────────────────────────────────────────
function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0a0a0a;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#f5f0e8">
  <div style="max-width:560px;margin:0 auto;background:#111;border:1px solid rgba(201,168,76,0.25);border-radius:14px;overflow:hidden">
    <div style="padding:20px 24px;border-bottom:1px solid rgba(201,168,76,0.2)">
      <div style="font-size:22px;letter-spacing:3px;color:#c9a84c;font-weight:bold">AURA</div>
      <div style="font-size:10px;letter-spacing:2px;color:#a89b8c;text-transform:uppercase">Curry House Cafe</div>
    </div>
    <div style="padding:24px">
      <h1 style="margin:0 0 16px;font-size:18px;color:#f5f0e8">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="padding:14px 24px;border-top:1px solid rgba(245,240,232,0.08);font-size:11px;color:#a89b8c">
      Automated notification from ${RESTAURANT}.
    </div>
  </div></body></html>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:4px 0;color:#a89b8c;font-size:13px">${label}</td>
    <td style="padding:4px 0;color:#f5f0e8;font-size:13px;text-align:right">${value}</td></tr>`;
}

// ── Order templates ─────────────────────────────────────────
export function renderOrderEmail(o: OrderNotification): RenderedMessage {
  const subject = `🛎️ New Order #${o.id} — ${ORDER_TYPE_LABEL[o.deliveryType]} (${money(o.total)})`;

  const itemsHtml = o.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;color:#f5f0e8;font-size:13px">${i.name} <span style="color:#a89b8c">×${i.quantity}</span></td>
         <td style="padding:6px 0;color:#c9a84c;font-size:13px;text-align:right">${money(i.price * i.quantity)}</td></tr>`,
    )
    .join("");

  const bodyHtml = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px">
      ${row("Order Type", ORDER_TYPE_LABEL[o.deliveryType])}
      ${row("Customer", o.customerName)}
      ${row("Mobile", o.customerMobile)}
      ${o.deliveryType === "delivery" && o.customerAddress ? row("Address", o.customerAddress) : ""}
      ${o.notes ? row("Notes", o.notes) : ""}
    </table>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid rgba(245,240,232,0.1);padding-top:8px">
      ${itemsHtml}
    </table>
    <table style="width:100%;border-collapse:collapse;margin-top:10px;border-top:1px solid rgba(245,240,232,0.1)">
      ${row("Subtotal", money(o.subtotal))}
      ${row("GST (10%)", money(o.tax))}
      <tr><td style="padding:8px 0;color:#f5f0e8;font-size:15px;font-weight:bold">Total</td>
      <td style="padding:8px 0;color:#c9a84c;font-size:15px;font-weight:bold;text-align:right">${money(o.total)}</td></tr>
    </table>`;

  return { subject, html: emailShell(subject, bodyHtml), text: renderOrderWhatsApp(o) };
}

export function renderOrderWhatsApp(o: OrderNotification): string {
  const lines = [
    `*🛎️ New Order #${o.id} — ${RESTAURANT}*`,
    ``,
    `*Type:* ${ORDER_TYPE_LABEL[o.deliveryType]}`,
    `*Customer:* ${o.customerName}`,
    `*Mobile:* ${o.customerMobile}`,
  ];
  if (o.deliveryType === "delivery" && o.customerAddress) lines.push(`*Address:* ${o.customerAddress}`);
  lines.push(``, `*Items:*`);
  o.items.forEach((i) => lines.push(`• ${i.name} ×${i.quantity} — ${money(i.price * i.quantity)}`));
  lines.push(``, `*Subtotal:* ${money(o.subtotal)}`, `*GST:* ${money(o.tax)}`, `*Total:* ${money(o.total)}`);
  if (o.notes) lines.push(``, `*Notes:* ${o.notes}`);
  return lines.join("\n");
}

// ── Reservation templates ───────────────────────────────────
export function renderReservationEmail(r: ReservationNotification): RenderedMessage {
  const subject = `📅 New Reservation — ${r.name}, ${r.guests} guest${r.guests === 1 ? "" : "s"} (${r.date} ${r.time})`;
  const bodyHtml = `
    <table style="width:100%;border-collapse:collapse">
      ${row("Name", r.name)}
      ${row("Phone", r.phone)}
      ${row("Date", r.date)}
      ${row("Time", r.time)}
      ${row("Guests", String(r.guests))}
      ${r.notes ? row("Notes", r.notes) : ""}
    </table>`;
  return { subject, html: emailShell(subject, bodyHtml), text: renderReservationWhatsApp(r) };
}

export function renderReservationWhatsApp(r: ReservationNotification): string {
  const lines = [
    `*📅 New Reservation — ${RESTAURANT}*`,
    ``,
    `*Name:* ${r.name}`,
    `*Phone:* ${r.phone}`,
    `*Date:* ${r.date}`,
    `*Time:* ${r.time}`,
    `*Guests:* ${r.guests}`,
  ];
  if (r.notes) lines.push(`*Notes:* ${r.notes}`);
  return lines.join("\n");
}

// ── Channel senders (dormant until env configured) ──────────
async function sendEmail(msg: RenderedMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !from || !to) return false;
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject: msg.subject, html: msg.html, text: msg.text }),
  });
  if (!resp.ok) throw new Error(`Resend ${resp.status}: ${await resp.text()}`);
  return true;
}

async function sendWhatsApp(text: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
  const to = process.env.NOTIFY_WHATSAPP_TO; // e.g. "whatsapp:+61..."
  if (!sid || !token || !from || !to) return false;
  const body = new URLSearchParams({ From: from, To: to, Body: text });
  const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  if (!resp.ok) throw new Error(`Twilio ${resp.status}: ${await resp.text()}`);
  return true;
}

async function dispatch(label: string, email: RenderedMessage, whatsappText: string): Promise<void> {
  let delivered = false;
  try {
    if (await sendEmail(email)) { delivered = true; console.log(`[notify] ${label}: email sent`); }
  } catch (e) {
    console.error(`[notify] ${label}: email failed —`, e instanceof Error ? e.message : e);
  }
  try {
    if (await sendWhatsApp(whatsappText)) { delivered = true; console.log(`[notify] ${label}: whatsapp sent`); }
  } catch (e) {
    console.error(`[notify] ${label}: whatsapp failed —`, e instanceof Error ? e.message : e);
  }
  if (!delivered) {
    // No channel configured yet — log the ready-to-send message.
    console.log(`[notify] ${label}: no channel configured. Message:\n${whatsappText}`);
  }
}

// ── Public API (call these from routers; fire-and-forget) ───
export async function notifyNewOrder(o: OrderNotification): Promise<void> {
  await dispatch(`order #${o.id}`, renderOrderEmail(o), renderOrderWhatsApp(o));
}

export async function notifyNewReservation(r: ReservationNotification): Promise<void> {
  await dispatch(`reservation #${r.id}`, renderReservationEmail(r), renderReservationWhatsApp(r));
}
