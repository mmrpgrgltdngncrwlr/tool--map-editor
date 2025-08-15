export function SubscriptionFactory({ onNotify, onSubscribe }) {
  const subscriptions = new Set();
  function subscribe(callback) {
    onSubscribe(callback);
    subscriptions.add(callback);
    return function () {
      subscriptions.delete(callback);
    };
  }
  function notify() {
    onNotify(subscriptions);
  }
  return { subscribe, notify };
}
