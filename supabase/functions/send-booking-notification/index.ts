import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM_ADDRESS = Deno.env.get("RESEND_FROM_ADDRESS") || "onboarding@resend.dev";

// Create a Supabase client with service role for admin access
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  operatorId: string;
  operatorName: string;
  consumerName: string;
  consumerEmail: string;
  serviceName: string;
  requirements: string;
  preferredDate?: string;
  preferredTime?: string;
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!FROM_ADDRESS || FROM_ADDRESS.endsWith('resend.dev')) {
      console.warn("FROM_ADDRESS not set to a verified domain. Current:", FROM_ADDRESS);
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid from address. Please verify a domain in Resend and set RESEND_FROM_ADDRESS (e.g., notifications@yourdomain.com)."
      }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    const booking: BookingNotificationRequest = await req.json();

    // Fetch operator's email using service role
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(booking.operatorId);
    
    if (authError || !authUser.user?.email) {
      return new Response(
        JSON.stringify({ 
          error: "Could not fetch operator email",
          success: false 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const operatorEmail = authUser.user.email;

    // Format the preferred date and time
    let scheduleText = "No specific timing requested";
    if (booking.preferredDate || booking.preferredTime) {
      const datePart = booking.preferredDate ? `Date: ${booking.preferredDate}` : "";
      const timePart = booking.preferredTime ? `Time: ${booking.preferredTime}` : "";
      scheduleText = [datePart, timePart].filter(Boolean).join(", ");
    }

    const emailResponse = await resend.emails.send({
      from: `SkyMarket <${FROM_ADDRESS}>`,
      to: [operatorEmail],
      subject: `🚁 New Booking Request: ${booking.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #BD1B04; font-size: 24px; margin-bottom: 20px; text-align: center;">
              🚁 New Booking Request
            </h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">Service Request Details</h2>
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Customer:</strong> ${booking.consumerName}</p>
              <p><strong>Email:</strong> ${booking.consumerEmail}</p>
              <p><strong>Preferred Schedule:</strong> ${scheduleText}</p>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-bottom: 10px;">Special Requirements:</h3>
              <p style="color: #856404; margin: 0;">${booking.requirements || "No special requirements mentioned"}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; margin-bottom: 20px;">
                Ready to accept this booking? Log in to your operator dashboard to respond.
              </p>
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://fdqaiwugmumcqfolksrp.supabase.co', 'https://project-fdqaiwugmumcqfolksrp.lovable.app')}/operator-dashboard/bookings" 
                 style="background-color: #BD1B04; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View Booking Requests
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                This email was sent from SkyMarket - Detroit's drone service marketplace
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Resend error: ${emailResponse.error.message || 'Unknown error'}`);
    }

    console.log("Booking notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true, 
      messageId: emailResponse.data?.id,
      message: "Booking notification sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send booking notification",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);