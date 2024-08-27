import { cart } from "../../data/cart-class.js";

export function renderCheckoutHeader(){
  let cartQuantity = 0;

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const header = (cartQuantity === 1)
    ? `${cartQuantity} item`
    : `${cartQuantity} items`;

  const html =`Checkout (
  <a class="return-to-home-link js-return-to-home-link" href="index.html">
    ${header}
  </a>)`;
  
  document.querySelector('.js-header-middle-section')
    .innerHTML = html;
}