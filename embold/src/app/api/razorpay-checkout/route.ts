import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const Session = await getAuthSession();

    if (!Session?.user) return new Response("UNAUTHORIZED", { status: 401 });

    const body = await req.json();

    const {
      paymentIntentId,
      addressId,
      cartItem,
    }: {
      paymentIntentId: string;
      addressId: string;
      cartItem: {
        inventoryId: string;
        price: number;
        quantity: number;
      }[];
    } = body;

    const totalAmount = cartItem.reduce(
      (total, sum) => total + sum.price * sum.quantity,
      0
    );

    console.log(body);

    if (paymentIntentId) {
      const newPaymentIntentId = await instance.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
      });

      console.log(
        "payment",
        paymentIntentId,
        "new payment",
        newPaymentIntentId
      );

      const exist = await db.orders.findFirst({
        where: {
          paymentIntentId: paymentIntentId,
        },
        select: {
          InventoryOnOrders: {
            select: {
              id: true,
            },
          },
        },
      });

      const [existingOrder, updateOrder] = await Promise.all([
        db.orders.findFirst({
          where: {
            paymentIntentId: paymentIntentId,
          },
        }),
        db.orders.update({
          where: {
            paymentIntentId: paymentIntentId,
          },
          data: {
            paymentIntentId: newPaymentIntentId.id,
            amount: totalAmount,
            Address: {
              connect: {
                id: addressId,
              },
            },
            InventoryOnOrders: {
              delete: exist?.InventoryOnOrders.map((invent) => {
                return {
                  id: invent.id,
                };
              }),
              create: cartItem.map(
                (invent: {
                  inventoryId: string;
                  price: number;
                  quantity: number;
                }) => {
                  return {
                    inventory: { connect: { id: invent.inventoryId } },
                    price: invent.price,
                    quantity: invent.quantity,
                  };
                }
              ),
            },
          },
        }),
      ]);

      // update order

      if (!existingOrder) {
        return new Response("Invalid Payment Intent", { status: 400 });
      }

      return NextResponse.json({
        paymentIntent: newPaymentIntentId,
        order: updateOrder,
      });
      // return new Response("ok");
    } else {
      const paymentIntent = await instance.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
      });

      const order = await db.orders.create({
        data: {
          email: Session.user.email!,
          isOnline: true,
          paid: false,
          Address: {
            connect: {
              id: addressId,
            },
          },
          amount: totalAmount,
          paymentIntentId: paymentIntent.id,
          status: "ORDERED",
          user: {
            connect: {
              email: Session.user.email!,
            },
          },
          InventoryOnOrders: {
            create: cartItem.map(
              (invent: {
                inventoryId: string;
                price: number;
                quantity: number;
              }) => {
                return {
                  inventory: { connect: { id: invent.inventoryId } },
                  price: invent.price,
                  quantity: invent.quantity,
                };
              }
            ),
          },
        },
      });
      return NextResponse.json({ paymentIntent, order });
    }
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
