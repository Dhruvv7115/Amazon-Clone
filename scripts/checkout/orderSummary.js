import { cart } from '../../data/cart-class.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function getDeliveryDate(day){
  let deliveryDate = ''
  switch(day.getDay()){
    case 0:
      deliveryDate += 'Sunday, '
      break;
    case 1:
      deliveryDate += 'Monday, '
      break;
    case 2:
      deliveryDate += 'Tuesday, '
      break;
    case 3:
      deliveryDate += 'Wednesday, '
      break;
    case 4:
      deliveryDate += 'Thursday, '
      break;
    case 5:
      deliveryDate += 'Friday, '
      break;
    case 6:
      deliveryDate += 'Saturday, '
      break;
    default:
      console.log('no day')
      return; 
  }
  switch(day.getMonth()){
    case 0:
      deliveryDate += 'January '
      break;
    case 1:
      deliveryDate += 'February '
      break;
    case 2:
      deliveryDate += 'March '
      break;
    case 3:
      deliveryDate += 'April '
      break;
    case 4:
      deliveryDate += 'May '
      break;
    case 5:
      deliveryDate += 'June '
      break;
    case 6:
      deliveryDate += 'July '
      break;
    case 7:
      deliveryDate += 'August '
      break;
    case 8:
      deliveryDate += 'September '
      break;
    case 9:
      deliveryDate += 'October '
      break;
    case 10:
      deliveryDate += 'November '
      break;
    case 11:
      deliveryDate += 'December '
      break;
    default:
      console.log('no month')
      return; 
  }

  deliveryDate += day.getDate()
  return deliveryDate;
}

export function renderOrderSummary(){
  let cartSummaryHTML = '';
  if(cart.cartItems.length !== 0){
    cart.cartItems.forEach((cartItem) => {
      const { productId, deliveryOptionId } = cartItem;

      const matchingProduct = getProduct(productId);

      const deliveryOption = getDeliveryOption(deliveryOptionId);

      const dateString = calculateDeliveryDate(deliveryOption);

      cartSummaryHTML += `
        <div class="cart-item-container
          js-cart-item-container
          js-cart-item-container-${matchingProduct.id}">    

          <div class="delivery-date">
            Delivery Date:
            <span class="js-delivery-date">${dateString}</span>
          </div>

          <div class="cart-item-details-grid">

            <img class="product-image"
              src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name js-product-name-${matchingProduct.id}">
                ${matchingProduct.name}
              </div>
              <div class="product-price js-product-price-${matchingProduct.id}">
                ${matchingProduct.getPrice()}
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
    });
  }else {
    cartSummaryHTML += `
      <div>
        Your cart is empty.
      </div>
      <a class="button-primary view-products-link" href="index.html">
        View products
      </a>
    `;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  function deliveryOptionsHTML(matchingProduct, cartItem){
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      // const today = dayJs();
      // const deliveryDate = today.add(
      //   deliveryOption.deliveryDays,
      //   'days');
      // const dateString = deliveryDate.format('dddd, MMMM D');
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryOption.deliveryDays);
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceCentsString = (deliveryOption.priceCents === 0)
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option 
        js-delivery-option-${matchingProduct.id}-
        ${deliveryOption.id}"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input
            js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">

          <div>
            <div class="delivery-option-date">${dateString}</div>
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

        cart.removeFromCart(productId);

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

      cart.updateQuantity(productId, newQuantity);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.classList.remove('is-editing-quantity');

      renderPaymentSummary();

      renderCheckoutHeader();

      renderOrderSummary();
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
          cart.updateQuantity(productId, newQuantity);

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
        cart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

