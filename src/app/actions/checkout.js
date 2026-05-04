"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { validateDiscountCode } from "@/lib/discounts";
import { v4 as uuidv4 } from "uuid";

export async function createPendingOrder(cartItems, shippingDetails, discountCode) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("You must be logged in to checkout.");

    // 1. Fetch live products/variants to calculate true prices securely
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });

      if (!variant) throw new Error(`Item ${item.title} is no longer available.`);
      if (variant.stock_count < item.quantity) {
        throw new Error(`Only ${variant.stock_count} left of ${item.title} (${item.variantLabel}).`);
      }

      const truePrice = variant.price || variant.product.price;
      subtotal += truePrice * item.quantity;

      orderItemsData.push({
        product_id: variant.product.id,
        variant_id: variant.id,
        variant_snapshot: item.variantLabel,
        quantity: item.quantity,
        price_at_purchase: truePrice
      });
    }

    // 2. Securely calculate discount (if applied)
    let finalTotal = subtotal;
    let appliedDiscountId = null;

    if (discountCode) {
      const cartItemCollectionIds = cartItems.map(item => item.collectionId).filter(Boolean);
      const discountResult = await validateDiscountCode(discountCode, subtotal, cartItemCollectionIds);
      
      if (discountResult.isValid) {
        finalTotal = discountResult.newTotal;
        appliedDiscountId = discountResult.discountId;
      }
    }

    // 3. Generate a unique transaction reference for Squad
    const transactionRef = `RECKLESS-${uuidv4().slice(0, 8).toUpperCase()}`;

    // 4. Create the "Pending" order in the database
    const order = await prisma.order.create({
      data: {
        customer_id: user.id,
        phone_number: shippingDetails.phone,
        total_amount: finalTotal,
        discount_code_id: appliedDiscountId,
        status: "pending", // Will update to "paid" after Squad confirmation
        squad_transaction_ref: transactionRef,
        shipping_address: shippingDetails,
        items: {
          create: orderItemsData
        }
      }
    });

    // Return the required data to initialize the Squad popup
    return {
      success: true,
      orderId: order.id,
      transactionRef: transactionRef,
      email: user.email,
      // Squad requires the amount in Kobo (multiply Naira by 100)
      amountInKobo: Math.round(finalTotal * 100), 
    };

  } catch (error) {
    console.error("Checkout initialization error:", error);
    return { error: error.message || "Failed to initialize checkout." };
  }
}