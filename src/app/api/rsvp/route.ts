import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { RSVPFormData } from '@/types/rsvp';

export async function POST(request: NextRequest) {
  try {
    const body: RSVPFormData = await request.json();

    // Validate required fields
    if (!body.fullName?.trim()) {
      return NextResponse.json(
        { success: false, message: 'El nombre y apellido son requeridos.' },
        { status: 400 }
      );
    }

    if (!body.cedula?.trim()) {
      return NextResponse.json(
        { success: false, message: 'La cédula de identidad es requerida.' },
        { status: 400 }
      );
    }

    if (!body.phone?.trim()) {
      return NextResponse.json(
        { success: false, message: 'El número de teléfono es requerido.' },
        { status: 400 }
      );
    }

    // Check for env vars with safe defaults
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.RSVP_RECIPIENT_EMAIL || 'jviera97@gmail.com';

    if (!resendApiKey) {
      // If Resend is not configured, we return success so that client-side formsubmit handles it seamlessly
      return NextResponse.json({
        success: true,
        message: 'Confirmación registrada con éxito.',
      });
    }

    const resend = new Resend(resendApiKey);

    const now = new Date();
    const timestamp = now.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const guestNamesFormatted =
      body.guestNames && body.guestNames.length > 0
        ? body.guestNames.filter((n) => n.trim()).join(', ')
        : 'Ninguno';

    const emailHtml = `
      <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF8F5; border: 1px solid #e5e0d8;">
        <h1 style="color: #3D4A35; font-size: 22px; text-align: center; margin-bottom: 8px;">
          🎉 Nueva confirmación — 15 de Julia
        </h1>
        <p style="color: #7A8B6F; text-align: center; font-size: 13px; margin-bottom: 32px;">
          Recibida el ${timestamp}
        </p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; width: 140px; vertical-align: top;">
              Nombre
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px; font-weight: bold;">
              ${body.fullName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Cédula de Identidad
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px; font-weight: bold;">
              ${body.cedula}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Teléfono
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px;">
              <a href="tel:${body.phone}" style="color: #3D4A35; text-decoration: none;">${body.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Asistencia
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px; font-weight: bold;">
              ${body.attending === 'yes' ? '✅ Sí, va a asistir' : '❌ No va a poder asistir'}
            </td>
          </tr>
          ${
            body.guestCount && body.guestCount > 0
              ? `<tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Acompañantes
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px;">
              ${body.guestCount}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Nombres
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px;">
              ${guestNamesFormatted}
            </td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Alimentación
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d8; color: #3D4A35; font-size: 15px;">
              ${body.dietaryNotes || 'Sin requerimientos especiales'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #7A8B6F; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">
              Mensaje
            </td>
            <td style="padding: 12px 0; color: #3D4A35; font-size: 15px;">
              ${body.message || 'Sin mensaje'}
            </td>
          </tr>
        </table>
      </div>
    `;

    await resend.emails.send({
      from: 'XV Julia <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `🎉 Nueva confirmación: ${body.fullName} — 15 de Julia`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Confirmación enviada exitosamente.',
    });
  } catch (error) {
    console.error('RSVP API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al enviar la confirmación.' },
      { status: 500 }
    );
  }
}
