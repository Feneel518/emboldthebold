import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { OrderValidator } from "@/lib/validators/Order";
import { z } from "zod";
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cartItem, isOnline, paid, userEmail, userName, userPhone, status } =
      OrderValidator.parse(body);

    const totalAmount = cartItem.reduce(
      (total, sum) => total + sum.price * sum.quantity,
      0
    );

    const emailCheck = await db.user.findUnique({
      where: {
        email: userEmail.toLowerCase(),
      },
    });

    let order;

    if (emailCheck) {
      order = await db.orders.create({
        data: {
          email: userEmail.toLowerCase(),
          isOnline: isOnline,
          paid: paid,
          amount: totalAmount,
          InventoryOnOrders: {
            create: cartItem.map((invent) => {
              return {
                inventory: { connect: { id: invent.inventoryId } },
                price: invent.price,
                quantity: invent.quantity,
              };
            }),
          },
          status: "DELIVERED",
          userName: userName,
          userPhone: userPhone,
          user: {
            connect: {
              email: userEmail.toLowerCase(),
            },
          },
          paymentIntentId: (Math.random() * 10000000000).toString(),
        },
      });
    } else {
      order = await db.orders.create({
        data: {
          email: userEmail.toLowerCase(),
          isOnline: isOnline,
          paid: paid,
          amount: totalAmount,
          InventoryOnOrders: {
            create: cartItem.map((invent) => {
              return {
                inventory: { connect: { id: invent.inventoryId } },
                price: invent.price,
                quantity: invent.quantity,
              };
            }),
          },
          status: "DELIVERED",
          userName: userName,
          userPhone: userPhone,
          paymentIntentId: (Math.random() * 10000000000).toString(),
        },
      });
    }

    const inventory = cartItem.map(async (item) => {
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

    return new Response("ok");
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
