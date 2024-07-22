import type { GetX, GetY } from "./handlers/direction";
import type { _PlayerAction, _ChainPlayerActions } from "./handlers/action";
import type { Game } from "./game";
import type { Length, Prettify, Shift } from "./helper";
import type { GetRoomAtLocation } from "./map";

export type DIRECTION = "north" | "south" | "east" | "west";
export type INSPECT = "inventory"

export type ACTION = DIRECTION | INSPECT

export type ROOM_TYPE = "room" | "hallway";
export type RoomName = "bedroom" | "living room" | "kitchen" | "bathroom" | "hallway" 
export type Room = {
  type: ROOM_TYPE;
  name: RoomName;
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};
export type Message = `${string}: ${string}`

export type Location = [x: number, y: number]
export type Inventory = Record<string, any>

type Events = Record<string, any> & {
  "current": undefined | any
}
type Visited = Record<`${number},${number}`, boolean>
type RecentLocationHistory = Array<Location>
type Health = number
type Debug = any;

/**
 * Player, this represents the players state within the world including
 * their location, inventory, and visited locations. 
 */
export type Player<
  TInitialLocation extends Location = Location,
  TRecentLocationHistory extends RecentLocationHistory = RecentLocationHistory,
  TCurrentLocation extends Location = Location,
  TEvents extends Events = Events,
  TInventory extends Inventory = {},
  TVisited extends Visited = {},
  THealth extends Health = 100,
  TDebug extends Debug = any
> = {
  initialLocation: TInitialLocation;
  recentLocationHistory: TRecentLocationHistory;
  currentLocation: TCurrentLocation;
  events: TEvents;
  inventory: TInventory;
  visited: TVisited;
  health: THealth;
  debug: TDebug;
}

export namespace Player {

  /**
   * PUBLIC METHODS
   */
  export type GetInitialLocation<TPlayer extends Player> = TPlayer["initialLocation"]
  export type GetCurrentLocation<TPlayer extends Player> = TPlayer["currentLocation"]
  export type GetInventory<TPlayer extends Player> = TPlayer["inventory"]
  export type GetVisited<TPlayer extends Player> = TPlayer["visited"]
  export type GetRecentLocationHistory<TPlayer extends Player> = TPlayer["recentLocationHistory"]
  export type GetEvents<TPlayer extends Player> = TPlayer["events"]
  export type GetHealth<TPlayer extends Player> = TPlayer["health"]
  export type GetDebug<TPlayer extends Player> = TPlayer["debug"]

  export type SetDebug<TGame extends Game, TDebug extends any> = 
    Game.UpdatePlayer<
      TGame,
      Player<
        TGame['player']['initialLocation'],
        TGame['player']['recentLocationHistory'],
        TGame['player']['currentLocation'],
        TGame['player']['events'],
        TGame['player']['inventory'],
        TGame['player']['visited'],
        TGame['player']['health'],
        TDebug
      >
    > 

  /**
   * Functionality relating to the players history
   */
  export namespace History {
    type GetHistoryWithCurrentLocation<TPlayer extends Player> =
      Length<TPlayer["recentLocationHistory"]> extends 5
        ? [...Shift<TPlayer["recentLocationHistory"]>, GetCurrentLocation<TPlayer>] 
        : [...TPlayer["recentLocationHistory"], GetCurrentLocation<TPlayer>]

    export type Visit<
      TGame extends Game,
      TLocation extends Location
    > = Game.UpdatePlayer<
      TGame,
      Player<
        GetInitialLocation<Game.GetPlayer<TGame>>,
        GetHistoryWithCurrentLocation<Game.GetPlayer<TGame>>,
        TLocation,
        GetEvents<Game.GetPlayer<TGame>>,
        GetInventory<Game.GetPlayer<TGame>>,
        Prettify<GetVisited<Game.GetPlayer<TGame>> & { 
          [Key in `${GetX<TLocation>},${GetY<TLocation>}`]: true
        }>,
        GetHealth<Game.GetPlayer<TGame>>,
        GetDebug<Game.GetPlayer<TGame>>
      >
    >
    
    /**
     * Indicates whether or not the player has visited a specified location
     */
    export type HasVisited<
      TPlayer extends Player<any, any>, 
      TLocation extends Location
    > = 
      TLocation extends [infer X extends number, infer Y extends number]
        ? `${X},${Y}` extends keyof GetVisited<TPlayer> 
          ? true 
          : false 
        : never
  }

  /**
   * Determines whether the player can navigate in the specified direction
   */
  export namespace Navigate {
    export type Can<
      TGame extends Game,
      TDirection extends DIRECTION
    > = GetRoomAtLocation<
      TGame, 
      GetCurrentLocation<TGame['player']>
    >[TDirection]
  }

}