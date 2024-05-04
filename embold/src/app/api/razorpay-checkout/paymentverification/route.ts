import { db } from "@/lib/db";
import { transporter } from "@/lib/email/email";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { response, orderId, cartItem } = body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET!);

    hmac.update(
      response.razorpay_order_id + "|" + response.razorpay_payment_id
    );
    let generatedSignature = hmac.digest("hex");
    let status = { sig: false };

    if (generatedSignature === response.razorpay_signature) {
      status = { sig: true };
    }

    if (status.sig) {
      const order = await db.orders.update({
        where: { id: orderId },
        data: {
          paid: true,
          paymentRazorpayId: response.razorpay_payment_id,
        },
        include: {
          user: true,
          InventoryOnOrders: {
            include: {
              inventory: {
                include: {
                  Product: {
                    include: {
                      Image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      const inventory = cartItem.map(async (item: any) => {
        await db.inventory.update({
          where: {
            id: item.inventoryId,
          },
          data: {
            Quantity: {
              update: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            },
          },
        });
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Your Order is successfully placed ",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>Thank you for placing your order with Embold!</p>
          <p>Your Order ID ${order.id} is confirmed. The team is packing your order with lot of love and care. It will be dispatched within next 3-4 business days and you can expect the delivery within 4-5 days after dispatch.
          </p>
          <p>You will receive an email with details as soon as your order is dispatched.</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    console.log(error);

    return new Response("Something went wrong, please try again later", {
      status: 500,
    });
  }
}

// <div class="content" style="width: 100%; display: flex; align-items: center;  justify-content: center; margin-top: 50px;">
// <div class="content-desc"

//  style=" display: flex;
//  align-items: center;
//  justify-content: center;
//  flex-direction: column;
//  font-size: 24px;
//  gap: 40px;">

//    <h4 style="padding: 0;
//  margin: 0;
//  font-size: 40px;">Your Order is Confirmed</h4>
//    <h4 style="padding: 0;
//  margin: 0;
//  font-size: 40px;">Feneel :)</h4>
//    <p style="  padding: 0;
//  margin: 0;">Thank you so much for placing your order with us.</p>
//    <p style="  padding: 0;
//  margin: 0;">
//      Our team is currently packing your order with lots of love and care.
//    </p>
//    <p style="  padding: 0;
//  margin: 0;">
//      It should be dispatched within the next 2-3 days and you can expect
//      delivery within 4-5 days after dispatch.
//    </p>
//    <p style="  padding: 0;
//  margin: 0;">We cannot wait for you to experience the awesomeness ✨</p>
//    <p style="  padding: 0;
//  margin: 0;">Talk Soon Feneel :)</p>
//  </div>
// </div>
