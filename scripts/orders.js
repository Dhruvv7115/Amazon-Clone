import { orders } from "../data/orders.js";
import { getDeliveryDate } from "./checkout/orderSummary.js";
import { formatCurrency } from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart-class.js";

loadProductsFetch().then(() => {
  loadPage();
  cart.updateCartQuantity();
});

function loadPage(){
  cart.updateCartQuantity();
  let ordersHTML = '';
  orders.forEach((order) => {
    console.log(orders);
    function loadOrderDetailsGrid(){
      let orderDetailsGridHTML = '';
      order.products.forEach((product) => {
        const { productId } = product;
        const matchingProduct = getProduct(productId);
        const { quantity } = product;
        // const today = dayjs();
        // const arrivalDate = dayjs(product.estimatedDeliveryTime).format('MMMM D');
        // const deliveryMessage = today > arrivalDate ? 'Delivered On' : 'Arriving On';
        const today = new Date();
        const arrivalDate = product.estimatedDeliveryTime;
        const deliveryMessage = today > arrivalDate ? 'Delivered On' : 'Arriving On';;


        orderDetailsGridHTML += `
          <div class="product-image-container">
            <img src=${matchingProduct.image}>
          </div>
  
          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <!--
            <div class="product-delivery-date">
              ${deliveryMessage}: ${arrivalDate}
            </div>
            -->
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
  
    // const { orderTime } = order;

    let date = order.orderTime;
    let year = date.slice(0,4);
    let month = date.slice(5,7);
    let dt = date.slice(8,10);
    let orderDate = year+'-' + month + '-'+ dt; 
    let orderTime = date.slice(11, 19);
    let hours = (orderTime.slice(0,2));
    (hours > 11) ? (orderTime += ' PM') : (orderTime += ' AM'); 

    // console.log(year+'-' + month + '-'+dt);
    const orderTotalCost = formatCurrency(order.totalCostCents);
    
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
              <div>${orderTime}</div>
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
        cart.updateCartQuantity();
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
      })
    })
}