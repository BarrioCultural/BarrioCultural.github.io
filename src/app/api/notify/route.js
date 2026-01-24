import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  'mailto:fran@ateliervirtual.art',
  'BG-LnxDWcr_4PGYVPdRr_L4qAnvgSGsc18-NAZR23bz4O1)mV8SEsV8ew_RlvEaSKPjN3mS9LI4wa-96-dWPKIY',
  'mdE23gCH8qrbeZeMYoPKLa0biCZaPFCrNRm0mJgy2kw'
);

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: subs, error } = await supabase
      .from('suscriptores')
      .select('subscription_data')
      .not('subscription_data', 'is', null);

    if (error) throw error;

    const payload = JSON.stringify({
      title: "🎨 ¡Nuevo contenido!",
      body: "Acabo de subir algo nuevo, ¡pásate a verlo!",
    });

    const notifications = (subs || []).map(sub => 
      webpush.sendNotification(sub.subscription_data, payload)
        .catch(err => console.error("Error en un envío:", err.endpoint))
    );

    await Promise.all(notifications);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}