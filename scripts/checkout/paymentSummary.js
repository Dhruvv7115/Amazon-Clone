import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary(){
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartItemQuantity = 0;

  cart.forEach((cartItem) => {
    const { productId, deliveryOptionId } = cartItem;
    let matchingProduct = getProduct(productId);
    productPriceCents += matchingProduct.priceCents * cartItem.quantity;
    
    let deliveryOption = getDeliveryOption(deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;

    cartItemQuantity += cartItem.quantity;
  });
  const totalBeforeTax = productPriceCents + shippingPriceCents;
  const taxCents = 0.1 * totalBeforeTax;
  const totalCents = totalBeforeTax + taxCents;
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartItemQuantity}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money 
      js-payment-summary-shipping">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTax)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money
      js-payment-summary-total">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;
  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;
}