export const cart = [];

export function addToCart(productId,quantity){
  let matchingItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = item;
    }
  });
  if(matchingItem){
    matchingItem.quantity += quantity;
  }else{
    cart.push({
      productId,
      quantity
    });
  }
}