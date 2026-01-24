import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import WebPush from "https://esm.sh/web-push"

const VAPID_PUBLIC_KEY = "BG-LnxDWcr_4PGYVPdRr_L4qAnvgSGsc18-NAZR23bz4O1MmV8SEsV8ew_RlvEaSKPjN3mS9LI4wa-96-dWPKIY";
const VAPID_PRIVATE_KEY = "mdE23gCH8qrbeZeMYoPKLa0biCZaPFCrNRm0mJgy2kw";

WebPush.setVapidDetails(
  "mailto:tu-email@ejemplo.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: subs } = await supabase
    .from('suscriptores')
    .select('subscription_data')
    .not('subscription_data', 'is', null);

  const notificationPayload = JSON.stringify({
    title: "¡Nuevo dibujo en el Atelier!",
    body: "Ven a ver lo último que he subido.",
  });

  const sendPromises = subs?.map((sub: any) => {
    return WebPush.sendNotification(sub.subscription_data, notificationPayload)
      .catch(err => console.error("Error enviando:", err));
  });

  await Promise.all(sendPromises || []);

  return new Response(JSON.stringify({ message: "Notificaciones enviadas" }), {
    headers: { "Content-Type": "application/json" },
  });
})