import type { Player, Player } from "./entities/player";
import type { Game } from "./game";
import type { _Action, _ChainActions } from "./handlers/action";
import type { Location, Room } from "./_player";
import type { ResolveHistory } from "./_resolve";
import type { MapInstance } from "./maps/floor1";
import type { GetRoomAtLocation, GetXFromEntity } from "./interactions/navigation/direction";

type VerifyStartLocation<N extends Location> = MapInstance[N[1]][N[0]] extends Room ? MapInstance[N[1]][N[0]] : never

type InitializePlayer<N extends Location> = Player<{
  history: [VerifyStartLocation<N>], 
  location: N, 
  inventory: { pickles: 1, cheese: 1, bacon: 1 },
  visited: { [Key in `${N[0]},${N[0]}`]: true }
}>

/**
 * SETUP
 */
export type PlayerInstance = InitializePlayer<[1, 1]>

export type GameInstance = Game.Create<{
  map: MapInstance,
  player: PlayerInstance
}>

type ResultingGameState = Game.Action.ChainPlayerActions<GameInstance, [
  "south",
  "east",
  "east",
  "north",
]>

type PlayerLocation = Game.GetPlayer<ResultingGameState>['position']
type Visited = Game.GetPlayer<ResultingGameState>['visited']
type History = ResolveHistory<Game.GetPlayer<ResultingGameState>>
type player = Game.GetPlayer<ResultingGameState>


type room = GetRoomAtLocation<[
  GetXFromEntity<player>, 
  GetXFromEntity<player>
]>
