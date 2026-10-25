// A method decorator receives 3 things:
// target = the class, propertyKey = the method name, descriptor = the method itself

// Refuse a spell if its power is negative
export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  // save the original method
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  // replace it with a new method that checks the spell first
  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const candidate: unknown = args[0];

    if (
      typeof candidate === "object" &&
      candidate !== null &&
      "power" in candidate &&
      typeof candidate.power === "number" &&
      candidate.power < 0
    ) {
      throw new Error("Spell power cannot be negative");
    }

    // the spell is fine, so call the original method
    return originalMethod.apply(this, args);
  };
}

// Save the results of a method so we don't calculate the same thing twice
export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  // one cache for each object
  const instanceCaches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: unknown[]): unknown {
    // get the cache of this object, or create it
    let cache = instanceCaches.get(this);
    if (!cache) {
      cache = new Map<string, unknown>();
      instanceCaches.set(this, cache);
    }

    // the key is made from the arguments, for example [10,3] becomes "[10,3]"
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`[CACHE HIT] ${String(propertyKey)}`);
      return cache.get(key);
    }

    console.log(`[CACHE MISS] ${String(propertyKey)}`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
