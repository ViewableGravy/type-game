/***************************************************************************************
 * TYPE HELPERS
 **************************************************************************************/
export type ValueOf<T> = T[keyof T];
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/***************************************************************************************
 * BOOLEAN HELPERS
 **************************************************************************************/
export type Not<T extends boolean> = T extends true ? false : true;
export type If<T extends boolean, Then, Else> = T extends true ? Then : Else;
export type Switch<T extends any, Cases extends Array<{ [K in any]: any }>> = 
  T extends keyof Cases[0]
    ? ValueOf<Cases[0]>:
  Switch<T, Shift<Cases>>;

/***************************************************************************************
 * ARRAY HELPERS
 **************************************************************************************/
export type Pop<T extends Array<any>> = T extends [...infer Rest, infer Last] ? Rest : never;
export type Shift<T extends Array<any>> = T extends [infer First, ...infer Rest] ? Rest : never;
export type Push<T extends any[], V> = [...T, V];
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
export type ShiftUntil<T extends any[], N extends number> = 
  Length<T> extends N ? T : ShiftUntil<Shift<T>, N>;

export type Chunk<
  TOriginal extends Array<any>, 
  TChunkSize extends number, 
  TLeftChunk extends Array<any> = []
> =
  TChunkSize extends TLeftChunk['length'] 
    ? [TLeftChunk, ...Chunk<TOriginal, TChunkSize>] :
  TOriginal extends [infer F, ...infer CurrentRight] 
    ? Chunk<CurrentRight, TChunkSize, [...TLeftChunk, F]> :
  Length<TLeftChunk> extends 0
    ? TLeftChunk
    : [TLeftChunk];

export type HasNextIndex<TIndex extends number, TArray extends any[]> = 
  TArray['length'] extends TIndex 
    ? true 
    : false

export type HasPreviousIndex<TIndex extends number, TArray extends any[]> = 
  TIndex extends 0 
    ? false 
    : HasIndex<TIndex, TArray>

export type HasIndex<TIndex extends number, TArray extends any[]> = 
  TArray extends Record<TIndex, any> 
    ? true 
    : false

/***************************************************************************************
 * TUPLE HELPERS
 **************************************************************************************/
export type Length<T extends any[]> = T extends { length: infer L extends number } ? L : never;
export type UnionToCommaSeparated<T extends string> =
  TuplifyUnion<T> extends []
    ? "" :
  TuplifyUnion<T> extends [infer First]
    ? First extends string ? `${First}` : never :
  TuplifyUnion<T> extends [infer First, ...infer Rest]
    ? First extends string ? `${First}, ${UnionToCommaSeparated<Rest[number] extends string ? Rest[number] : never>}` : never :
  never

/**
 * OTHER
 */
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.1+
export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>