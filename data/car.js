class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen = false;
  constructor(carDetails){
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  };

  displayInfo() {
    console.log(`${this.#brand} ${this.#model}, Speed: ${this.speed} km/hr, ${this.isTrunkOpen ? 'open' : 'closed'}`);
  }

  go() {
    if((this.speed === 200)||(this.isTrunkOpen)){
      return;
    }
    this.speed +=5; 
  }

  brake() {
    if(this.speed === 0){
      return;
    }
    this.speed -=5;
  }

  openTrunk() {
    if(this.speed !== 0){S
      return;
    }
    this.isTrunkOpen = true;
  }

  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

class RaceCar extends Car{
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }


  go() {
    if((this.speed === 300)||(this.isTrunkOpen)){
      return;
    }
    this.speed += this.acceleration; 
  }

  openTrunk() {
    console.log('Race Cars do not have a trunk.');
  }

  closeTrunk() {
    console.log('Race Cars do not have a trunk.');
  }
}

const car1 = new Car({
  brand: 'Toyota',
  model: 'Corolla'
});
const car2 = new Car({
  brand: 'Tesla',
  model: 'Model 3'
});

const raceCar = new RaceCar({
  brand: 'McLaren',
  model: 'F1',
  acceleration: 20
});

console.log(car1);
console.log(car2);
console.log(raceCar);

car1.openTrunk();
car1.displayInfo();
car2.displayInfo();

car1.go();
car1.go();
car1.brake();
car2.go();
car2.go();
car2.brake();
car1.closeTrunk();
car1.go();

car1.displayInfo();
car2.displayInfo();

raceCar.go();
raceCar.go();
raceCar.go();
raceCar.displayInfo();
raceCar.openTrunk();
raceCar.displayInfo();
raceCar.brake();
raceCar.displayInfo();

raceCar.displayInfo();