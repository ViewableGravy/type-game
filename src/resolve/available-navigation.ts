/***** IMPORTS *****/
import type { If, Shift } from "../helper"
import type { DIRECTION, Room } from "../location"
import type { Printer } from "../print"

type DirectionToString<TRoom extends Room, TDirection extends DIRECTION> = 
  TDirection extends 'north'
    ? TRoom['north'] extends true ? 'north' : "" :
  TDirection extends 'south'
    ? TRoom['south'] extends true ? 'south' : "" :
  TDirection extends 'east'
    ? TRoom['east'] extends true ? 'east' : "" :
  TDirection extends 'west'
    ? TRoom['west'] extends true ? 'west' : "" :
  never

type SomeAreNotEmpty<T extends Array<string>, TCount extends number = 0> =
  T extends [] 
    ? TCount extends 0 ? false : true 
    : Printer.IsEmpty<T[0]> extends true
      ? SomeAreNotEmpty<Shift<T>, TCount>
      : TCount extends 0 ? true : false

type WithCommaIfExists<T extends string> = If<Printer.IsEmpty<T>, T, `${T}, `> 

type SimplifyDirections<
  N extends string, 
  S extends string, 
  E extends string, 
  W extends string
> =
  Printer.Condition.ChainResolve<[
    [SomeAreNotEmpty<[S, E, W]>, WithCommaIfExists<N>],
    [SomeAreNotEmpty<[E, W]>, WithCommaIfExists<S>],
    [SomeAreNotEmpty<[W]>, WithCommaIfExists<E>],
    [true, W]
  ]>

export type DisplayUserNavigationOptions<TRoom extends Room> =
  SimplifyDirections<
    DirectionToString<TRoom, 'north'>,
    DirectionToString<TRoom, 'south'>,
    DirectionToString<TRoom, 'east'>,
    DirectionToString<TRoom, 'west'>
  >