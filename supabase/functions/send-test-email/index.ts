import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM_ADDRESS = Deno.env.get("RESEND_FROM_ADDRESS") || "onboarding@resend.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Test Email Request ===");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: TestEmailRequest = await req.json();

    if (!FROM_ADDRESS || FROM_ADDRESS.endsWith('resend.dev')) {
      console.warn("FROM_ADDRESS not set to a verified domain. Current:", FROM_ADDRESS);
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid from address. Please verify a domain in Resend and set RESEND_FROM_ADDRESS (e.g., notifications@yourdomain.com)."
      }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    console.log(`Sending test email to: ${email}`);

    if (!email) {
      throw new Error("Email address is required");
    }

    const emailResponse = await resend.emails.send({
      from: `SkyMarket Test <${FROM_ADDRESS}>`,
      to: [email],
      subject: "🚁 Hey there! Test message from SkyMarket! ✨",
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
          <div style="background-color: white; padding: 40px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid #e1e5e9;">
            
            <!-- Header with fun emoji and gradient text -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="background: linear-gradient(135deg, #BD1B04 0%, #e53e3e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: bold; margin: 0; line-height: 1.2;">
                🚁 SkyMarket Test! 🎉
              </h1>
              <div style="font-size: 24px; margin: 15px 0;">✨🦄🌈✨</div>
            </div>

            <!-- Cute message -->
            <div style="background: linear-gradient(45deg, #fef7ed 0%, #fff7ed 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #BD1B04; margin-bottom: 25px;">
              <p style="font-size: 18px; color: #2d3748; line-height: 1.6; margin: 0;">
                Hey there, awesome human! 👋
              </p>
              <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin: 15px 0 0 0;">
                This is just a super cute test message from your friends at <strong style="color: #BD1B04;">SkyMarket</strong>! 
                If you're reading this, our email system is working perfectly! 🎯
              </p>
            </div>

            <!-- Fun facts section -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
              <h3 style="color: #BD1B04; font-size: 18px; margin: 0 0 15px 0; display: flex; align-items: center;">
                🤖 Fun Test Facts:
              </h3>
              <ul style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>This email traveled through the internets at light speed! ⚡</li>
                <li>It was crafted with love by our awesome admin panel 💝</li>
                <li>No drones were harmed in the making of this email 🚁</li>
                <li>You're officially part of the SkyMarket test crew! 🎊</li>
              </ul>
            </div>

            <!-- Call to action -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #BD1B04 0%, #e53e3e 100%); padding: 15px 30px; border-radius: 25px; display: inline-block;">
                <p style="color: white; font-weight: bold; font-size: 16px; margin: 0;">
                  🎉 Email Test Successful! 🎉
                </p>
              </div>
            </div>

            <!-- Cute footer -->
            <div style="text-align: center; border-top: 2px dashed #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #718096; font-size: 14px; margin: 0;">
                Made with ❤️ by the SkyMarket team in Detroit 🏙️
              </p>
              <p style="color: #a0aec0; font-size: 12px; margin: 10px 0 0 0;">
                P.S. - Thanks for being awesome! Keep being amazing! ⭐
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
    
    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Test email sent successfully!",
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send test email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);