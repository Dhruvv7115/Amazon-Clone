import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/products.js';
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart-class.js";

// import '../data/cart-class.js'
//import '../data/car.js';
//import '../data/backend-practice.js';

async function loadPage(){
  await loadProductsFetch();

  const value = await new Promise((resolve) => {
    loadCart(() => {
      resolve('value3');
    });
  });
  console.log(value);

  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
  
}
loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
]).then((values) => {
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
});
*/

/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve('value 1');
  });

}).then((value) => {
  console.log(value);
  return new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });

}).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
});
*/

/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();
  });
});
*/


