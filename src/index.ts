import type { Game } from "./game";
import type { _ChainActions } from "./handlers/action";
import type { Location, Player, Room } from "./player";
import type { ResolveHistory } from "./resolve";
import type { Hallway } from "./rooms/hallway";

export type CreateMap<TMap extends Array<Array<Room>>> = TMap

type Bedroom = { name: "bedroom", type: "room", north: true, south: false, east: false, west: false }

type InitializePlayer<N extends Location> = Player<[MapInstance[N[1]][N[0]]], N, { pickles: 1, cheese: 1, bacon: 1 }, { [Key in `${N[0]},${N[0]}`]: true }>

/**
 * SETUP
 */

export type MapInstance = CreateMap<[
  [Hallway<false, false, true, false>, Hallway<false, true, true, true>, Hallway<false, true, false, true>],
  [Hallway<true, false, false, false>, Hallway<true, true, false, false>, Bedroom],
  [Hallway<false, false, true, false>, Hallway<false, false, true, true>, Hallway<false, false, true, true>],
]>;

export type PlayerInstance = InitializePlayer<[1, 1]>

export type GameInstance = Game.Create<{
  map: MapInstance,
  player: PlayerInstance
}>

type ResultingGameState = Game.Action.ChainPlayerActions<GameInstance, [
  "north",
  "east",
  "south",
  "inventory",
  "north",
  "inventory",
  "south",
  "north",
  "west",
  "south",
  "south",
  "east"
]>

type PlayerLocation = Game.GetPlayer<ResultingGameState>['_location']
type Visited = Game.GetPlayer<ResultingGameState>['_visited']
type History = ResolveHistory<Game.GetPlayer<ResultingGameState>>
    