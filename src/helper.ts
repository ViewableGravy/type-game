
/** Boolean Helpers */
export type Not<T extends boolean> = T extends true ? false : true;
export type If<T extends boolean, Then, Else> = T extends true ? Then : Else;

/**** ARRAY HELPERS ****/
export type HasIndex<TIndex extends number, TArray extends any[]> = 
  TArray extends Record<TIndex, any> 
    ? true 
    : false

export type Pop<T extends Array<any>> = T extends [...infer Rest, infer Last] ? Rest : never;
export type Shift<T extends Array<any>> = T extends [infer First, ...infer Rest] ? Rest : never;
export type Some<T extends Array<any>, TType> =
  T extends [] 
    ? false 
    : T[0] extends TType 
      ? true 
      : Some<Shift<T>, TType>
export type Every<T extends Array<any>, TType> =
  T extends [] 
    ? true 
    : T[0] extends TType 
      ? Every<Shift<T>, TType>
      : false

export type HasNextIndex<TIndex extends number, TArray extends any[]> = 
  TArray['length'] extends TIndex 
    ? true 
    : false

export type HasPreviousIndex<TIndex extends number, TArray extends any[]> = 
  TIndex extends 0 
    ? false 
    : HasIndex<TIndex, TArray>

/***** NUMBER HELPERS *****/
export type BuildTuple<L extends number, T extends any[] = []> = 
  T['length'] extends L 
    ? T 
    : BuildTuple<L, [any, ...T]>;

export type GetMinusOne<N extends number> = 
  BuildTuple<N> extends [any, ...infer Rest] 
    ? Rest['length'] 
    : N;
    
export type GetPlusOne<N extends number> = [...BuildTuple<N>, any]['length'] extends number 
  ? [...BuildTuple<N>, any]['length'] 
  : never;

/**
 * Tuple helpers
 */

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>
