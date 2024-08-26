import { cart } from '../data/cart-class.js';
import { products, loadProductsFetch } from '../data/products.js';

async function loadPage(){
  await loadProductsFetch();
  renderProductsGrid();
}
loadPage();

function renderProductsGrid(){
  const url = new URL(location.href);
  const search = url.searchParams.get('search');
  let filteredProducts = products;
  if (search){
    const lowerCaseSearch = search.toLowerCase();
    filteredProducts = products.filter((product) => {
      return (product.name.toLowerCase().includes(lowerCaseSearch) || product.keywords.includes(lowerCaseSearch));
    });
  }
  let productsHTML = '';
  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <!-- 
          we can use ternary operator to check if the product is instanceof Clothing if yes then we can return the link to size chart else return an empty string 
        -->
        <!-- 
          1)But we have used 'Polymorphism'. 
          2)Polymorphism : use a method w/o knowing the class.
          3)extraInfoHTML() is defined in both the parent and child class but it returns the link to size chart in child class (Clothing) and returns an empty string in parent class (Product). 
        -->
        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-button"
        data-product-id = "${product.id}">
          Add to Cart
        </button>
      </div>`;
  });
  document.querySelector('.js-products-grid')
    .innerHTML = productsHTML ;

  function updateCartQuantity(){
    const cartQuantity = cart.calculateCartQuantity();
    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }
  updateCartQuantity();

  const addedMessageTimeouts = {};

  document.querySelectorAll('.js-add-to-cart-button')
    .forEach((button) =>{
      button.addEventListener('click',() => {

        const {productId} = button.dataset;

        const selectorValue = document.querySelector(`.js-quantity-selector-${productId}`);
        
        const quantity = Number(selectorValue.value);

        cart.addToCart(productId,quantity);

        updateCartQuantity();
        
        const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

        const previousTimeoutId = addedMessageTimeouts[productId];
        if (previousTimeoutId) {
          clearTimeout(previousTimeoutId);
        }
          
        const timeoutId = setTimeout(() => {
          addedMessage.classList.remove('added-to-cart-visible');
        }, 2000);

        addedMessage.classList.add('added-to-cart-visible');

        addedMessageTimeouts[productId] = timeoutId;
        
      });
    }); 
}
function searchButtonFunction(){
  const value = document.querySelector('.js-search-bar').value;
  location.href = `amazon.html?search=${value}`;
}
// middle section HTML
document.querySelector('.js-search-button').addEventListener('click', () => {
  searchButtonFunction();
});
document.addEventListener('keydown', (event) => {
  if(event.key === "Enter"){
    searchButtonFunction();
  }
});
