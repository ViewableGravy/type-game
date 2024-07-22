import type { Game } from "../game";
import type { Prettify } from "../helper";
import type { Int } from "../helpers/maths";
import type { Location, Room } from "../player";
import type { Hallway } from "./hallway";

// TODO: Properly handle rooms on the edge of the map (ensuring that they cannot navigate beyond the map by changing the value of the location if they are)

type Map = Array<Array<{}>>

export type CreateMap<TMap extends Map, TRowNumber extends number = 0> = 
  TMap extends []
    ? [] :
  TMap extends [infer IRow extends Array<Room>] // row
    ? [HandleRow<IRow, TRowNumber>] :
  TMap extends [infer IRow extends Array<Room>, ...infer IRest extends Map] // row, ...
    ? [HandleRow<IRow, TRowNumber>, ...CreateMap<IRest, Int.Add<TRowNumber, 1>>] :
  never;

type HandleRow<TRow extends Array<Room>, TRowNumber extends number, TColumnNumber extends number = 0> = 
  TRow extends []
    ? [] :
  TRow extends [infer IColumn extends Room] // column
    ? [HandleRoom<IColumn, TRowNumber, TColumnNumber>] :
  TRow extends [infer IColumn extends Room, ...infer IRest extends Array<Room>] // column, ...
    ? [HandleRoom<IColumn, TRowNumber, TColumnNumber>, ...HandleRow<IRest, TRowNumber, Int.Add<TColumnNumber, 1>>] :
  never;

type HandleRoom<TColumn extends Room, TRowNumber extends number, TColumnNumber extends number> = TColumn & {
  location: [TColumnNumber, TRowNumber]
}
  
export type GetY<TLocation extends Location> = TLocation[1]
export type GetX<TLocation extends Location> = TLocation[0]
export type GetRoomAtLocation<TGame extends Game, TLocation extends Location> = Game.GetMap<TGame>[GetY<TLocation>][GetX<TLocation>]
