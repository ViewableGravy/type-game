import type { ChainActions } from "./handlers/action";
import type { BuildTuple, Chunk } from "./helper";
import type { Location, Player, Room } from "./location";
import type { ResolveHistory } from "./resolve";
import type { Hallway } from "./rooms/hallway";

export type CreateMap<TMap extends Array<Array<Room>>> = TMap

type Bedroom = { name: "bedroom", type: "room", north: true, south: false, east: false, west: false }

export type Map = CreateMap<[
  [Hallway<false, false, true, false>, Hallway<false, true, true, true>, Hallway<false, true, false, true>],
  [Hallway<true, false, false, false>, Hallway<true, true, false, false>, Bedroom],
  [Hallway<false, false, true, false>, Hallway<false, false, true, true>, Hallway<false, false, true, true>],
]>;

type InitializePlayer<N extends Location> = Player<[Map[N[1]][N[0]]], N, { pickles: 1, cheese: 1, bacon: 1 }, { [Key in `${N[0]},${N[0]}`]: true }>

type Result = ChainActions<InitializePlayer<[1, 1]>, [
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
  "south"
]>

type PlayerLocation = Result['_location']
type Visited = Result['_visited']
type History = ResolveHistory<Result>
    