import { getDeliveryDate } from '../scripts/checkout/orderSummary.js';

export function getDeliveryOption(deliveryOptionId){
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId){
      deliveryOption = option;
    }
  });
  return deliveryOption;
}
export function calculateDeliveryDate(deliveryOption){

  let deliveryDate = new Date();
  let remainingDays = deliveryOption.deliveryDays;

  while (remainingDays > 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    if (!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }

  const dateString = getDeliveryDate(deliveryDate);

  return dateString;
  // let deliveryDate = dayJs();

  // let remainingDays = deliveryOption.deliveryDays;
  
  // while (remainingDays > 0) {
  //   deliveryDate = deliveryDate.add(1, 'day');

  //   if (!isWeekend(deliveryDate)) {
  //     remainingDays--;
  //   }
  // }

  // const dateString = deliveryDate.format(
  //   'dddd, MMMM D');
}

function isWeekend(date) {
  return getDeliveryDate(date).includes('Sunday') || getDeliveryDate(date).includes('Saturday');
}

export const deliveryOptions = [{
    id: '1',
    deliveryDays: 10,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];