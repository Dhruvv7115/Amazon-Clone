import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { getProduct, products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import dayJs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary(){
  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {
    const { productId, deliveryOptionId } = cartItem;

    const matchingProduct = getProduct(productId);

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity 
            js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label  js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link 
              link-primary js-update-link"
              data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input js-quantity-input-${matchingProduct.id}"
              data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link"
              data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link 
              link-primary js-delete-link 
              js-delete-link-${matchingProduct.id}"
              data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options js-delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`
  })

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  function deliveryOptionsHTML(matchingProduct, cartItem){
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayJs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceCentsString = (deliveryOption.priceCents === 0)
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceCentsString} Shipping
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }


  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click',() => {
        const { productId } = link.dataset;
        removeFromCart(productId);
        renderPaymentSummary();

        renderOrderSummary();

        renderCheckoutHeader();
    });
  });

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');

      });
    });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
      const { productId } = link.dataset;

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(quantityInput.value);

      if (newQuantity <= 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 1 and less than 1000');
        return;
      }
      updateQuantity(productId, newQuantity);
      renderPaymentSummary();
      renderCheckoutHeader();

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

    });
  });
  document.querySelectorAll('.js-quantity-input')
    .forEach((input) => {
      input.addEventListener('keydown',(event) => {
        const { productId } = input.dataset;
        if(event.key === 'Enter'){
          const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
          const newQuantity = Number(quantityInput.value);

          if (newQuantity <= 0 || newQuantity >= 1000) {
            alert('Quantity must be at least 1 and less than 1000');
            return;
          }
          updateQuantity(productId, newQuantity);

          const container = document.querySelector(`.js-cart-item-container-${productId}`);
          container.classList.remove('is-editing-quantity');

          renderCheckoutHeader();

          renderPaymentSummary();

          renderOrderSummary();
        }
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click',() => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      })
    })
}

