export class Store {
  currentValue;
  subscriptionSet = new Set();
  constructor(initialValue) {
    this.currentValue = initialValue;
  }
  subscribe(callback) {
    console.log('store, subscribe');
    this.subscriptionSet.add(callback);
    callback(this.currentValue);
    return () => {
      console.log('store, unsubscribe');
      this.subscriptionSet.delete(callback);
    };
  }
  get value() {
    console.log('store, get');
    return this.currentValue;
  }
  set(value) {
    console.log('store, set', value);
    this.currentValue = value;
    for (const callback of this.subscriptionSet) {
      callback(value);
    }
  }
  update(callback) {
    console.log('store, update');
    this.set(callback(this.currentValue));
  }
}

export class ComputedStore {
  source;
  computeFn;
  cachedValue;
  subscriptionSet = new Set();
  sourceUnsubscribe = undefined;
  constructor(source, computeFn) {
    this.source = source;
    this.computeFn = computeFn;
  }
  subscribe(callback) {
    console.log('computed, subscribe');
    if (this.subscriptionSet.size === 0) {
      this.sourceUnsubscribe = this.source.subscribe((value) => {
        const newCachedValue = this.computeFn(value);
        if (this.cachedValue !== newCachedValue) {
          this.cachedValue = newCachedValue;
          for (const callback of this.subscriptionSet) {
            callback(newCachedValue);
          }
        }
      });
    }
    this.subscriptionSet.add(callback);
    if (this.cachedValue) {
      callback(this.cachedValue);
    }
    return () => {
      console.log('computed, unsubscribe');
      this.subscriptionSet.delete(callback);
      if (this.subscriptionSet.size === 0) {
        this.sourceUnsubscribe?.();
      }
    };
  }
  get value() {
    console.log('computed, get');
    return this.computeFn(this.source.value);
  }
}
const counter = new Store(0);
console.log(counter.value);
counter.set(1);
console.log(counter.value);
const isEven = new ComputedStore(counter, (value) => (value & 1) === 0);
console.log(isEven.value);
counter.set(2);
console.log(isEven.value);
const parity = new ComputedStore(isEven, (value) => (value ? 'even' : 'odd'));
counter.set(3);
console.log(parity.value);
console.log();
console.log('the important part');
const parityUnsubscribe = parity.subscribe((value) => console.log('EFFECT, parity:', value));
console.log();
counter.set(2);
console.log('isEven:', isEven.value);
console.log('parity:', parity.value);
console.log();
counter.set(4);
console.log('isEven:', isEven.value);
console.log('parity:', parity.value);
console.log('effect is not called because the value of parity did not change');
console.log();
console.log('unsubscribe');
parityUnsubscribe();
console.log('effect will no longer be called, because of unsubscription');
console.log();
counter.set(5);
console.log('isEven:', isEven.value);
console.log('parity:', parity.value);
console.log();
counter.set(7);
console.log('isEven:', isEven.value);
console.log('parity:', parity.value);
console.log();
counter.set(4);
console.log('isEven:', isEven.value);
console.log('parity:', parity.value);
