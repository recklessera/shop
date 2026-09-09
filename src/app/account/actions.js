"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePrismaProfile(userId, formData) {
  try {
    // Parse the address JSON string back to an object
    let parsedAddress = null;
    if (formData.saved_addresses) {
      try {
        parsedAddress = JSON.parse(formData.saved_addresses);
      } catch (e) {
        console.error("Invalid address JSON");
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: formData.name,
        phone_number: formData.phone_number,
        saved_addresses: parsedAddress,
      },
    });

    // Tell Next.js to refresh the data on the account page
    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update profile information." };
  }
}
export async function cancelPendingOrder(orderId) {
  try {
    // 1. Check if the order exists and is actually pending
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.status !== "PENDING") {
      return { error: "Only pending orders can be cancelled." };
    }

    // 2. Update the status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });

    // 3. Refresh the account page
    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to cancel the order." };
  }
}