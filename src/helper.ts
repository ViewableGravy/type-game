
/**** ARRAY HELPERS ****/

export type HasIndex<TIndex extends number, TArray extends any[]> = 
  TArray extends Record<TIndex, any> 
    ? true 
    : false

export type Pop<T extends Array<any>> = T extends [...infer Rest, infer Last] ? Rest : never;
export type Shift<T extends Array<any>> = T extends [infer First, ...infer Rest] ? Rest : never;

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
