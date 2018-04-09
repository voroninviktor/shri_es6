class EventEmitter {
  callbacks: Map<any, any>;
  constructor() {
    this.callbacks = new Map();
  }
  emit(eventName) {
    const handlersSet = this.callbacks.get(eventName);
    if (handlersSet) {
      handlersSet.forEach(h => {
        h();
      });
    }
  }

  on(eventName, cb) {
    const handlersSet = this.callbacks.get(eventName);
    if (!handlersSet) {
      this.callbacks.set(eventName, new Set([cb]));
    } else {
      handlersSet.add(cb);
    }
  }

  off(eventName, cb) {
    const handlersSet = this.callbacks.get(eventName);
    if (handlersSet) {
      handlersSet.delete(cb);
      if (handlersSet.size === 0) this.callbacks.delete(eventName);
    }
  }
}

export default EventEmitter;
