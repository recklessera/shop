"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { validateDiscountCode } from "@/lib/discounts";
import { v4 as uuidv4 } from "uuid";

// Must perfectly match the frontend logic
function getShippingRate(state) {
  if (!state) return 0;
  
  if (state === "Lagos") return 3500;
  if (["Ogun", "Oyo", "Osun", "Ondo", "Ekiti"].includes(state)) return 5500;
  if (["FCT - Abuja", "Rivers"].includes(state)) return 7000;
  
  return 10000; // Nationwide fallback
}

export async function createPendingOrder(cartItems, shippingDetails, discountCode) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) throw new Error("You must be logged in to checkout.");
    if (!shippingDetails.state) throw new Error("A valid state is required for shipping.");

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
    let discountDeduction = 0;
    let appliedDiscountId = null;

    if (discountCode) {
      const cartItemCollectionIds = cartItems.map(item => item.collectionId).filter(Boolean);
      const discountResult = await validateDiscountCode(discountCode, subtotal, cartItemCollectionIds);
      
      if (discountResult.isValid) {
        discountDeduction = discountResult.deduction;
        appliedDiscountId = discountResult.discountId;
      }
    }

    // 3. Securely calculate location-based shipping (Standard only)
    const shippingCost = getShippingRate(shippingDetails.state);

    // Final mathematical truth
    const finalTotal = Math.max(0, subtotal - discountDeduction) + shippingCost;
    const transactionRef = `RECKLESS-${uuidv4().slice(0, 8).toUpperCase()}`;

    // 4. Create the "Pending" order and UPDATE User Profile in one transaction
    const order = await prisma.$transaction(async (tx) => {
      // A. Update the User profile if data is missing (Auto-Save Feature)
      const fullName = `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim();
      
      await tx.user.update({
        where: { id: authUser.id },
        data: {
          // Only update name/phone if they are currently null/empty
          name: { set: fullName }, 
          phone_number: { set: shippingDetails.phone },
          // Always save the latest shipping address as their default
          saved_addresses: shippingDetails 
        }
      });

      // B. Create the Order
      return await tx.order.create({
        data: {
          customer_id: authUser.id,
          phone_number: shippingDetails.phone,
          total_amount: finalTotal,
          discount_code_id: appliedDiscountId,
          status: "pending", 
          squad_transaction_ref: transactionRef,
          shipping_address: {
            ...shippingDetails,
            method: "standard",
            cost: shippingCost
          },
          items: {
            create: orderItemsData
          }
        }
      });
    });

    return {
      success: true,
      orderId: order.id,
      transactionRef: transactionRef,
      email: authUser.email,
      amountInKobo: Math.round(finalTotal * 100), 
    };

  } catch (error) {
    console.error("Checkout initialization error:", error);
    return { error: error.message || "Failed to initialize checkout." };
  }
}