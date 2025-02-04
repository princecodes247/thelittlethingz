/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type Serializable = {
  toJSON(): any;
  toString(): any;
};
type Serialized<T> = T extends Serializable
  ? ReturnType<T['toString']>
  : T extends (infer U)[]
  ? Serialized<U>[]
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : T;

/**
 * Serializes all values of an object using their .toJSON() method if available.
 * @param obj - The input object to serialize.
 * @returns A new object with serialized values and an accurate type.
 */
export function serializeValues<T>(obj: T): Serialized<T> {
  if (Array.isArray(obj)) {
    return obj.map(item => serializeValues(item)) as Serialized<T>;
  }

  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && 'toJSON' in value && typeof (value as Serializable).toJSON === 'function') {
        result[key] = (value as Serializable).toString();
      } else {
        result[key] = serializeValues(value); // Recursively serialize nested objects/arrays
      }
    }
    return result as Serialized<T>;
  }

  return obj as Serialized<T>;
}
