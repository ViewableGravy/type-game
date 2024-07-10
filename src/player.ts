import type { GetRoomAtLocation, GetX, GetXFromPlayer, GetY, GetYFromPlayer } from "./handlers/direction";
import type { _Action, _ChainActions } from "./handlers/action";

export type DIRECTION = "north" | "south" | "east" | "west";

export type ACTION = DIRECTION | "inventory"

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

/**
 * Player, this represents the players state within the world including
 * their location, inventory, and visited locations. 
 */
export type Player<
  TRoomHistory extends Array<Room | Message> = any, 
  TLocation extends Location = any,
  TInventory extends Record<string, any> = {},
  TVisited extends Record<`${number},${number}`, boolean> = {}
> = {
  history: TRoomHistory;
  _location: TLocation;
  _inventory: TInventory;
  _visited: TVisited;
}

export namespace Player {

  /**
   * Clones a player object that can then be used to reduce or manipulate without affecting the original player object
   */
  export type Clone<TPlayer extends Player> = Player<
    TPlayer["history"],
    TPlayer["_location"],
    TPlayer["_inventory"],
    TPlayer["_visited"]
  > 

  /**
   * PUBLIC METHODS
   */
  export type GetHistory<TPlayer extends Player> = TPlayer["history"]
  export type GetLocation<TPlayer extends Player> = TPlayer["_location"]
  export type GetInventory<TPlayer extends Player> = TPlayer["_inventory"]
  export type GetVisited<TPlayer extends Player> = TPlayer["_visited"]

  /**
   * Functionality relating to the players history
   */
  export namespace History {
    /**
     * Returns a new Player object with the history updated to include the provided location as 
     * well as marking the position as visited in the players visited attribute
     */
    export type Visit<
      TPlayer extends Player, 
      TLocation extends Location
    > = Player<
      [...TPlayer["history"], GetRoomAtLocation<TLocation>],
      TLocation,
      TPlayer["_inventory"],
      TPlayer["_visited"] & { 
        [Key in `${GetX<TLocation>},${GetY<TLocation>}`]: true
      }
    > 

    /**
     * Adds a message to the players history (_data), this can be used for providing feedback to the player
     * regarding an action they have attempted to taken. This is generally used for invalid actions
     */
    export type PushMessage<
      TPlayer extends Player, 
      TMessage extends Message
    > = Player<
      [...TPlayer["history"], TMessage],
      TPlayer["_location"],
      TPlayer["_inventory"],
      TPlayer["_visited"]
    >
    
    /**
     * Indicates whether or not the player has visited a specified location
     */
    export type HasVisited<
      TPlayer extends Player<any, any>, 
      TLocation extends Location
    > = 
      TLocation extends [infer X extends number, infer Y extends number]
        ? `${X},${Y}` extends keyof TPlayer["_visited"] 
          ? true : 
        false :
      never
  }

  /**
   * Determines whether the player can navigate in the specified direction
   */
  export namespace Navigate {
    export type Can<
      TPlayer extends Player, 
      TDirection extends DIRECTION
    > =
      GetRoomAtLocation<[
        GetXFromPlayer<TPlayer>, 
        GetYFromPlayer<TPlayer>
      ]>[TDirection]

  }

}