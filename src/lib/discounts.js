import { prisma } from '@/lib/prisma'

/**
 * Validates a discount code and calculates the deduction.
 * * @param {string} codeString - The raw text the user typed in (e.g. " summer26 ")
 * @param {number} cartSubtotal - The total price of all items in the cart
 * @param {Array<string>} cartItemCollectionIds - An array of collection IDs currently in the cart
 * @returns {Object} { isValid, error, deduction, newTotal, discountId, code }
 */
export async function validateDiscountCode(codeString, cartSubtotal, cartItemCollectionIds = []) {
  // 0. Sanitize input
  if (!codeString || typeof codeString !== 'string') {
    return { isValid: false, error: 'Please enter a valid discount code.' }
  }
  
  const cleanCode = codeString.toUpperCase().replace(/\s+/g, '')

  // 1. Existence Check
  const discount = await prisma.discountCode.findUnique({
    where: { code_string: cleanCode }
  })

  if (!discount) {
    return { isValid: false, error: 'This discount code does not exist.' }
  }

  // 2. Active Status Check
  if (!discount.is_active) {
    return { isValid: false, error: 'This discount code is currently inactive.' }
  }

  // 3. Time Check
  if (discount.valid_until && new Date(discount.valid_until) < new Date()) {
    return { isValid: false, error: 'This discount code has expired.' }
  }

  // 4. Limit Check
  if (discount.usage_limit && discount.times_used >= discount.usage_limit) {
    return { isValid: false, error: 'This discount code has reached its maximum usage limit.' }
  }

  // 5. Threshold Check (Minimum Order Value)
  if (discount.min_order_value && cartSubtotal < discount.min_order_value) {
    return { 
      isValid: false, 
      error: `This code requires a minimum order value of ₦${discount.min_order_value.toLocaleString()}.` 
    }
  }

  // 6. Collection Lock Check
  if (discount.applicable_collection_id) {
    // Check if the cart contains at least one item from the required collection
    const hasApplicableItem = cartItemCollectionIds.includes(discount.applicable_collection_id)
    if (!hasApplicableItem) {
      return { isValid: false, error: 'This code is not applicable to the items in your cart.' }
    }
  }

  // --- ALL CHECKS PASSED: Calculate the math ---
  let deduction = 0

  if (discount.discount_type === 'PERCENT') {
    deduction = cartSubtotal * (discount.discount_value / 100)
  } else if (discount.discount_type === 'FIXED') {
    deduction = discount.discount_value
  }

  // Safety net: Never let a fixed discount make the cart total negative
  if (deduction > cartSubtotal) {
    deduction = cartSubtotal
  }

  // Final rounding to ensure clean currency numbers
  deduction = Math.round(deduction)
  const newTotal = cartSubtotal - deduction

  return {
    isValid: true,
    discountId: discount.id,
    code: discount.code_string,
    type: discount.discount_type,
    value: discount.discount_value,
    deduction,
    newTotal,
    error: null
  }
}