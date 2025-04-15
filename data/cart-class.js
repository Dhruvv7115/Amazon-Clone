class Cart{
  cartItems;
  #localStorageKey;

  constructor(localStorageKey){
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey))||[{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    },{
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  };

  saveToStorage(){
    localStorage.setItem(this.#localStorageKey,JSON.stringify(this.cartItems));
  };
  
  addToCart(productId,quantity){
    let matchingProduct;
    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingProduct = cartItem;
      }
    });
    if(matchingProduct){
      matchingProduct.quantity += quantity;
    }else{
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }
  
    this.saveToStorage();
  };

  removeFromCart(productId){
    const newCart = [];
  
    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId !== productId){
        newCart.push(cartItem);
      }
    })
  
    this.cartItems = newCart;
  
    this.saveToStorage();
  };

  resetCart(){
    this.cartItems = [];
    this.saveToStorage();
  };
  
  calculateCartQuantity() {
    let cartQuantity = 0;
  
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
  
    return cartQuantity;
  };

  updateQuantity(productId, newQuantity) {
    let matchingProduct;
  
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingProduct = cartItem;
      }
    });
  
    matchingProduct.quantity = newQuantity;
  
    this.saveToStorage();
  };
  
  updateCartQuantity(){
    const cartQuantity = cart.calculateCartQuantity();
    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }

  updateDeliveryOption(productId, deliveryOptionId){
    let matchingProduct;
  
    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchingProduct = cartItem;
      }
    });
  
    if(!matchingProduct){
      return;
    }
  
    matchingProduct.deliveryOptionId = deliveryOptionId;
    
    this.saveToStorage();
  }
}

export const cart = new Cart('cart-oop');

export function loadCart(fun){
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    //console.log(xhr.response);
    fun();
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

export async function loadCartFetch(){
  const response = await fetch('https://supersimplebackend.dev/cart');
  const text = await response.text();
  console.log(text);
  return text;
}
