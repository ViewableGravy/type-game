import type { Game } from "./game";
import type { _ChainPlayerActions } from "./handlers/action";
import type { Location, Player, Room } from "./player";
import type { ResolveHistory } from "./resolve";
import type { Hallway } from "./map/hallway";
import type { CreateMap, GetRoomAtLocation } from "./map";

type Bedroom = { name: "bedroom", type: "room", north: true, south: false, east: false, west: false }

type InitializePlayer<N extends Location> = Player<
  N, 
  [],
  N,
  { current: undefined },
  { pickles: 1, cheese: 1, bacon: 1 },
  { [Key in `${N[0]},${N[1]}`]: true },
  100,
  undefined
>

/**
 * SETUP
 */

export type MapInstance = CreateMap<[
  [Hallway<false, false, true, false>, Hallway<false, true, true, true>, Hallway<false, true, false, true>,  Hallway<false, true, true, false>],
  [Hallway<true, false, false, false>, Hallway<true, true, false, false>, Bedroom,                           Hallway<true, false, false, false>],
  [Hallway<false, false, true, false>, Hallway<true, false, true, true>, Hallway<false, false, true, true>, Hallway<false, false, true, false>]
]>;

export type PlayerInstance = InitializePlayer<[1, 1]>

export type GameInstance = Game.Create<
  MapInstance, 
  PlayerInstance
>

type ResultingGameState = Game.Action.ChainPlayerActions<GameInstance, [
  "south",
  "north",
  "south",
  "north",
  "south",
  "north",
  "south",
  "north",
  // "south",
  // "north",
  // "south",
  // "north",
  // "south",
  // "north",
  // "south",
  // "north",
  // "south",
  // "north",
  // "south",
  // "north",
  // "south",
  // "north",
  // "south",
  // "north",
]>


type PLAYER = Game.GetPlayer<ResultingGameState>['visited'];
type RECENT_HISTORY = Player.GetRecentLocationHistory<Game.GetPlayer<ResultingGameState>>
type DEBUG = Player.GetDebug<Game.GetPlayer<ResultingGameState>>
type CURRENT_ROOM = GetRoomAtLocation<ResultingGameState, Player.GetCurrentLocation<Game.GetPlayer<ResultingGameState>>>

    