import { db } from "@/lib/db";
import { transporter } from "@/lib/email/email";
import { DeliveryStatusValidator } from "@/lib/validators/DeliveryStatus";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courierDocketId, courierName, status, orderId } =
      DeliveryStatusValidator.parse(body);

    const order = await db.orders.update({
      where: {
        id: orderId,
      },
      data: {
        courierDocketId,
        courierName,
        status:
          status === "ORDERED"
            ? "ORDERED"
            : status === "IN_TRANSIT"
            ? "IN_TRANSIT"
            : "DELIVERED",
      },
      include: {
        user: true,
        InventoryOnOrders: {
          include: {
            inventory: {
              include: {
                Product: true,
              },
            },
          },
        },
      },
    });

    if (status === "IN_TRANSIT") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Your Order has been Shipped",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>We are Glad to inform you that your order has been shipped and will reach you soon. Please find the shipment details below: </p>
          <p>Order Number: ${orderId}</p> 
          <p>Shipping Carrier: ${courierName}</p> 
          <p>Tracking Number: ${courierDocketId}</p> </br>
          <p>Estimated Delivery Date: 4-5 Working days</p>  </br>
          <p>In case of any concerns regarding your order, feel free to reach out to us at ${process.env.EMAIL} </p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "DELIVERED") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Order successfully Delivered",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>We are excited to let you know that we have successfully Delivered your Order ${orderId}. 
          </p>
          <p>We hope that you will love your package. In case you have any concerns, feel free to connect with our team at ${process.env.EMAIL} 
          </p> 
          <p>You can share your pictures on ${process.env.EMAIL} to get featured on our Website and Instagram handles. </p> 
          <p>Also, don&apos;t forget to tag us (@emboldthebold) on your Instagram post while embracing the outfit.</p> </br>

          <p>Send with lots of LOVE!</p>  </br>
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "REFUND_ON_HOLD") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Refund On-Hold",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>We regret to inform you that the Return/Exchange product do not qualify for Refund due to not meeting the criteria of our Return/Exchange Policy:  
          </p>
          <a href="https://www.embold.co.in/return-exhchange">https://www.embold.co.in/return-exhchange 
          </a> 
          <p>The team is reviewing the case and will get in touch with you for further clarification.</p> 
         
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "REFUNDED") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Refund Successful ",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>We have successfully transferred your refund amount to your preferred Account. In case of any issues, feel free to revert back to this email. 
          </p>
          <p>If your request was to Exchange the product, you can go ahead and place a new order on our website.
          </p> 
     
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "REFUND_INITIATED") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Refund Initiated",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>This is to inform you that we have successfully verified your Return/Exchange Product and initiated the Refund process. Please revert with your account details where you want your refund to be processed: 
          </p>
          <p>Bank Name: </p> 
          <p>Account Number: </p> 
          <p>Account Type:  </p> 
          <p>IFSC Code:  </p> 
     
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "PRODUCT_RECEIVED") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Product Received",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>This is to inform you that we have received your Return/Exchange Product and it is under review as per the Return/Exchange Policy: 
          </p>
          <a href="https://www.embold.co.in/return-exhchange">https://www.embold.co.in/return-exhchange 
          </a> 
          <p>We will share the update in 3-4 working days. In case of any issues, feel free to revert to this email.
          </p> 
     
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "PRODUCT_PICKED_UP") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Product Picked Up",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>Thank you for handing over the product to the delivery partner. We will initiate the Exchange/ Return process as soon as we receive the product
          </p>
     
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "EXCHANGE_RETURN_INITIATED") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Exchange/Return Initiated",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>This is to inform you that your Exchange/Return has been initiated from our end. We have scheduled a pick up for the package. As soon as we will receive it, we will verify the product and share the updates with you as per the Return/Exchange Policy:
          </p>


          <a href="https://www.embold.co.in/return-exhchange">https://www.embold.co.in/return-exhchange 
          </a> 
     
          <p>Thank you for being our valued customer!</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }
    if (status === "DELIVERY_UNSUCCESSFUL") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: order.user?.email,
          subject: "EMBOLD: Delivery Unsuccessful",
          html: `<p>Hi ${order.user?.name}</p>
      
          <p>We regret to inform you that your Order ${order.id} faced delivery failure. Please revert on this email and share your contact details (Mobile Number) so that we can connect with you to ensure your package is delivered successfully to you.
          </p>
     
          <p>Thank you for being our valued customer!</p>
    
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
      return new Response(error.message, { status: 422 });
    }

    console.log(error);

    return new Response("Could not create a category, please try again later", {
      status: 500,
    });
  }
}
