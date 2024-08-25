import { orders } from "../data/orders.js";
import dayJs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart-class.js";

loadProductsFetch().then(() => {
  loadPage();
});

function loadPage(){
  let ordersHTML = '';
  orders.forEach((order) => {
    function loadOrderDetailsGrid(){
      let orderDetailsGridHTML = '';
      order.products.forEach((product) => {
        const { productId } = product;
        const matchingProduct = getProduct(productId);
        const { quantity } = product;
        const arrivalDate = dayJs(product.estimatedDeliveryTime).format('MMMM D');
        orderDetailsGridHTML += `
          <div class="product-image-container">
            <img src=${matchingProduct.image}>
          </div>
  
          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${arrivalDate}
            </div>
            <div class="product-quantity">
              Quantity: ${quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again-button"
            data-product-id="${productId}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>
  
          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${productId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      });
      return orderDetailsGridHTML;
    }
  
    const orderTimeString = dayJs(order.orderTime).format('MMMM D');
    const orderTotalCost = formatCurrency(order.totalCostCents);
    
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${orderTotalCost}</div>
            </div>
          </div>
  
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
  
        <div class="order-details-grid">
          ${loadOrderDetailsGrid()}
        </div>
      </div>
    `;
  });
  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;


  document.querySelectorAll('.js-buy-again-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const { productId } =button.dataset; 
        cart.addToCart(productId, 1);
        button.innerHTML = 'Added';
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
      })
    })
}