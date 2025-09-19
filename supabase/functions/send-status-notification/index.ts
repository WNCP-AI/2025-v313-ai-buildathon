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

interface StatusNotificationRequest {
  consumerId: string;
  bookingId: string;
  serviceName: string;
  newStatus: 'confirmed' | 'cancelled';
  operatorName: string;
  preferredDate?: string;
  preferredTime?: string;
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
    const notification: StatusNotificationRequest = await req.json();

    // Fetch consumer's email using service role
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(notification.consumerId);
    
    if (authError || !authUser.user?.email) {
      return new Response(
        JSON.stringify({ 
          error: "Could not fetch consumer email",
          success: false 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const consumerEmail = authUser.user.email;
    const consumerName = authUser.user.user_metadata?.full_name || authUser.user.email?.split('@')[0] || "Customer";

    // Format the preferred date and time
    let scheduleText = "No specific timing was requested";
    if (notification.preferredDate || notification.preferredTime) {
      const datePart = notification.preferredDate ? `Date: ${notification.preferredDate}` : "";
      const timePart = notification.preferredTime ? `Time: ${notification.preferredTime}` : "";
      scheduleText = [datePart, timePart].filter(Boolean).join(", ");
    }

    // Customize email content based on status
    const isConfirmed = notification.newStatus === 'confirmed';
    const statusText = isConfirmed ? 'confirmed' : 'cancelled';
    const statusEmoji = isConfirmed ? '✅' : '❌';
    const statusColor = isConfirmed ? '#10B981' : '#EF4444';
    const statusBgColor = isConfirmed ? '#D1FAE5' : '#FEE2E2';

    const emailResponse = await resend.emails.send({
      from: `SkyMarket <${FROM_ADDRESS}>`,
      to: [consumerEmail],
      subject: `${statusEmoji} Booking ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}: ${notification.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h1 style="color: ${statusColor}; font-size: 24px; margin-bottom: 20px; text-align: center;">
              ${statusEmoji} Booking ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}
            </h1>
            
            <div style="background-color: ${statusBgColor}; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid ${statusColor};">
              <h2 style="color: #333; font-size: 18px; margin-bottom: 15px;">
                ${isConfirmed ? 'Great news!' : 'Update on your booking request'}
              </h2>
              <p style="color: #333; margin: 0; font-size: 16px;">
                ${isConfirmed 
                  ? `Your booking request for "${notification.serviceName}" has been confirmed by ${notification.operatorName}.`
                  : `Unfortunately, your booking request for "${notification.serviceName}" has been cancelled by ${notification.operatorName}.`
                }
              </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">Booking Details</h3>
              <p><strong>Service:</strong> ${notification.serviceName}</p>
              <p><strong>Operator:</strong> ${notification.operatorName}</p>
              <p><strong>Requested Schedule:</strong> ${scheduleText}</p>
              <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold; text-transform: capitalize;">${statusText}</span></p>
            </div>

            ${isConfirmed ? `
              <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; margin-bottom: 10px;">Next Steps:</h3>
                <p style="color: #1e40af; margin: 0;">
                  The operator will contact you directly to finalize the details and arrange the service.
                </p>
              </div>
            ` : `
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                <h3 style="color: #92400e; margin-bottom: 10px;">Don't worry!</h3>
                <p style="color: #92400e; margin: 0;">
                  You can browse other available services and operators on SkyMarket to find the perfect match for your needs.
                </p>
              </div>
            `}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://fdqaiwugmumcqfolksrp.supabase.co', 'https://project-fdqaiwugmumcqfolksrp.lovable.app')}/browse" 
                 style="background-color: #BD1B04; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                ${isConfirmed ? 'View More Services' : 'Browse Other Services'}
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

    console.log("Status notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true, 
      messageId: emailResponse.data?.id,
      message: `Status notification sent successfully to ${consumerEmail}` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-status-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send status notification",
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