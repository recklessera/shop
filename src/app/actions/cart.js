"use server";

// Import your existing, highly-detailed logic!
import { validateDiscountCode } from "@/lib/discounts";

export async function applyDiscountAction(codeString, cartSubtotal, cartItemCollectionIds) {
  try {
    // Call your lib function and return the result to the client
    const result = await validateDiscountCode(codeString, cartSubtotal, cartItemCollectionIds);
    return result;
  } catch (error) {
    console.error("Discount validation error:", error);
    return { isValid: false, error: "An unexpected error occurred." };
  }
}