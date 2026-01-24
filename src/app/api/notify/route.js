import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configuración VAPID
webpush.setVapidDetails(
  'mailto:fran@ateliervirtual.art',
  'BG-LnxDWcr_4PGYVPdRr_L4qAnvgSGsc18-NAZR23bz4O1MmV8SEsV8ew_RlvEaSKPjN3mS9LI4wa-96-dWPKIY',
  'mdE23gCH8qrbeZeMYoPKLa0biCZaPFCrNRm0mJgy2kw'
);

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Obtenemos los tokens de la tabla 'suscriptores'
    const { data: subs, error: dbError } = await supabase
      .from('suscriptores')
      .select('subscription_data')
      .not('subscription_data', 'is', null);

    if (dbError) throw dbError;

    const payload = JSON.stringify({
      title: "🎨 ¡Nuevo arte!",
      body: "Hay algo nuevo en el Atelier. ¡Entra a verlo!",
      icon: "/icon.png",
    });

    // Envío masivo
    const results = await Promise.all(
      (subs || []).map(sub => 
        webpush.sendNotification(sub.subscription_data, payload)
          .catch(err => console.error("Error envío:", err.endpoint))
      )
    );

    return NextResponse.json({ success: true, sent: results.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}