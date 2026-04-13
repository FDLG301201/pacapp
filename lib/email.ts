import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'PACAPP <notificaciones@pacapp.do>'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendMessageNotification({
  to,
  recipientName,
  senderName,
  preview,
  conversationId,
  isSeller,
}: {
  to: string
  recipientName: string
  senderName: string
  preview: string
  conversationId: string
  isSeller: boolean
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const chatUrl = isSeller
    ? `${BASE_URL}/seller/chats`
    : `${BASE_URL}/chats?conv=${conversationId}`

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Nuevo mensaje de ${senderName} en PACAPP`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#0F7B5A;margin-bottom:8px">Tienes un nuevo mensaje</h2>
        <p style="color:#555;margin-bottom:16px">
          <strong>${senderName}</strong> te escribió:
        </p>
        <blockquote style="border-left:3px solid #0F7B5A;margin:0 0 24px;padding:12px 16px;background:#f5f5f5;border-radius:4px;color:#333">
          ${preview.length > 200 ? preview.slice(0, 200) + '…' : preview}
        </blockquote>
        <a href="${chatUrl}"
           style="display:inline-block;background:#0F7B5A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">
          Ver mensaje
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">
          PACAPP · Tu próxima prenda favorita está más cerca de lo que crees
        </p>
      </div>
    `,
  })
}

const PLAN_NAMES: Record<string, string> = {
  basic: 'Plan Básico',
  pro: 'Plan Pro',
  free: 'Plan Gratis',
}

export async function sendSubscriptionConfirmation({
  to,
  storeName,
  plan,
  endsAt,
}: {
  to: string
  storeName: string
  plan: string
  endsAt: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const planName = PLAN_NAMES[plan] ?? plan
  const endDate = new Date(endsAt).toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return resend.emails.send({
    from: FROM,
    to,
    subject: `¡Tu ${planName} en PACAPP está activo!`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#0F7B5A;margin-bottom:8px">¡Suscripción activada!</h2>
        <p style="color:#555;margin-bottom:16px">
          Hola, <strong>${storeName}</strong>. Tu comprobante fue verificado y tu suscripción está activa.
        </p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px">
          <p style="margin:0;color:#166534;font-size:15px">
            <strong>${planName}</strong> activo hasta el <strong>${endDate}</strong>
          </p>
        </div>
        <a href="${BASE_URL}/seller/suscripcion"
           style="display:inline-block;background:#0F7B5A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">
          Ver mi suscripción
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">
          PACAPP · Tu próxima prenda favorita está más cerca de lo que crees
        </p>
      </div>
    `,
  })
}

export async function sendSubscriptionRejection({
  to,
  storeName,
  plan,
  notes,
}: {
  to: string
  storeName: string
  plan: string
  notes?: string | null
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const planName = PLAN_NAMES[plan] ?? plan

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Tu solicitud de ${planName} en PACAPP fue rechazada`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626;margin-bottom:8px">Solicitud rechazada</h2>
        <p style="color:#555;margin-bottom:16px">
          Hola, <strong>${storeName}</strong>. No pudimos verificar tu comprobante de pago para el ${planName}.
        </p>
        ${notes ? `
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:24px">
          <p style="margin:0;color:#991b1b;font-size:14px"><strong>Motivo:</strong> ${notes}</p>
        </div>
        ` : ''}
        <p style="color:#555;margin-bottom:24px">
          Puedes intentarlo de nuevo subiendo un nuevo comprobante.
        </p>
        <a href="${BASE_URL}/seller/suscripcion"
           style="display:inline-block;background:#0F7B5A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">
          Intentar de nuevo
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">
          PACAPP · Tu próxima prenda favorita está más cerca de lo que crees
        </p>
      </div>
    `,
  })
}

export async function sendSubscriptionReminder({
  to,
  storeName,
  plan,
  daysLeft,
  endsAt,
}: {
  to: string
  storeName: string
  plan: string
  daysLeft: number
  endsAt: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const planName = PLAN_NAMES[plan] ?? plan
  const endDate = new Date(endsAt).toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Tu ${planName} vence en ${daysLeft} días`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#d97706;margin-bottom:8px">Tu suscripción está por vencer</h2>
        <p style="color:#555;margin-bottom:16px">
          Hola, <strong>${storeName}</strong>. Tu ${planName} vence el <strong>${endDate}</strong> (en ${daysLeft} días).
        </p>
        <p style="color:#555;margin-bottom:24px">
          Para seguir disfrutando de todos los beneficios, renueva tu suscripción subiendo un nuevo comprobante de pago.
        </p>
        <a href="${BASE_URL}/seller/suscripcion"
           style="display:inline-block;background:#0F7B5A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">
          Renovar suscripción
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">
          PACAPP · Tu próxima prenda favorita está más cerca de lo que crees
        </p>
      </div>
    `,
  })
}
