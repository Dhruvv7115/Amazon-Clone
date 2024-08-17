function Cart(localStorageKey){
  const cart = {
    cartItems: undefined,
  
    loadFromStorage(){
      this.cartItems = JSON.parse(localStorage.getItem(localStorageKey))||[{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      },{
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }];
    },
    
    saveToStorage(){
      localStorage.setItem(localStorageKey,JSON.stringify(this.cartItems));
    },
    
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
    },
    
    removeFromCart(productId){
      const newCart = [];
    
      this.cartItems.forEach((cartItem) => {
        if(cartItem.productId !== productId){
          newCart.push(cartItem);
        }
      })
    
      this.cartItems = newCart;
    
      saveToStorage();
    },
    
    calculateCartQuantity() {
      let cartQuantity = 0;
    
      this.cartItems.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
    
      return cartQuantity;
    },
    
    updateQuantity(productId, newQuantity) {
      let matchingProduct;
    
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingProduct = cartItem;
        }
      });
    
      matchingProduct.quantity = newQuantity;
    
      this.saveToStorage();
    },
  
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
  }; 
  return cart; 
}

const cart = Cart('cart-oop');
cart.loadFromStorage();
cart.addToCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e',1);

const businessCart = Cart('businessCart-oop');
businessCart.loadFromStorage();

console.log(cart.cartItems);
console.log(businessCart.cartItems);