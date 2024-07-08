import type { HandleEast, HandleNorth, HandleSouth, HandleWest } from "./handlers/direction";
import type { HandleInventory } from "./handlers/inventory";
import type { Shift } from "./helper";
import type { ACTION, DIRECTION, Location, Player, Room } from "./location";
import type { ResolveHistory } from "./resolve";
import type { Hallway } from "./rooms/hallway";

export type CreateMap<TMap extends Array<Array<Room>>> = TMap

export type Map = CreateMap<[
  [Hallway<false, false, true, false>, Hallway<false, true, true, true>, Hallway<false, true, false, true>],
  [Hallway<true, false, false, false, '0,1'>, Hallway<true, true, false, false>, { name: "bedroom", type: "room", north: true, south: false, east: false, west: false }],
  [Hallway<false, false, true, false>, Hallway<false, false, true, true>, Hallway<false, false, true, true>],
]>;


type InitializePlayer<N extends Location> = Player<[Map[N[1]][N[0]]], N, { pickles: 1, cheese: 1, bacon: 1 }, { [Key in `${N[0]},${N[0]}`]: true }>

type Navigate<TPlayer extends Player, TDirection extends DIRECTION> = 
  TDirection extends "north" ? HandleNorth<TPlayer> :
  TDirection extends "south" ? HandleSouth<TPlayer> :
  TDirection extends "east" ? HandleEast<TPlayer> :
  TDirection extends "west" ? HandleWest<TPlayer> :
  Player

type ChainNavigate<TPlayer extends Player, TDirections extends Array<DIRECTION>> =
  TDirections extends []
    ? TPlayer
    : ChainNavigate<Navigate<TPlayer, TDirections[0]>, Shift<TDirections>>

type ChainActions<TPlayer extends Player, TActions extends Array<ACTION>> =
  TActions extends []
    ? TPlayer
    : ChainActions<
      TActions[0] extends DIRECTION 
        ? Navigate<TPlayer, TActions[0]> : 
      TActions[0] extends "inventory" 
        ? HandleInventory<TPlayer> :
      TPlayer,
      Shift<TActions>
    >

// type Result = ChainNavigate<InitializePlayer<[1, 1]>, [
//   "north",
//   "east",
//   "south",
// ]>

type Result = ChainActions<InitializePlayer<[1, 1]>, [
  "north",
  "east",
  "south",
  "inventory"
]>







type PlayerLocation = Result['_location']
type History = ResolveHistory<Result>


