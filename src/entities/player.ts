/***** TYPE IMPORTS *****/
import type { GetRoomAtLocation, GetX, GetXFromEntity, GetY, GetYFromEntity } from "../interactions/navigation/direction";
import type { DIRECTION, Inventory, Location, Message, Room } from "../_player";
import type { Entity } from "./entity";

/***** TYPE DEFINITIONS *****/
type PlayerProps<
  THistory extends Array<Room | Message> = Array<Room | Message>,
  TLocation extends Location = Location,
  TInventory extends Inventory = Inventory,
  TVisited extends Record<`${number},${number}`, boolean> = Record<`${number},${number}`, boolean>
> = {
  history: THistory,
  location: TLocation,
  inventory: TInventory,
  visited: TVisited
}

type Position<TProps extends PlayerProps> = TProps['location'] extends undefined 
  ? Location 
  : TProps['location']

export type Player<TProps extends PlayerProps = PlayerProps> = Entity.Extend<{
  type: "player",
  enabled: true,
  position: Position<TProps>
}, {
  history: TProps['history'],
  inventory: TProps['inventory'],
  visited: TProps['visited']
}>



export namespace Player {

  /**
   * PUBLIC METHODS
   */
  export type GetHistory<TPlayer extends Player> = TPlayer["history"]
  export type GetLocation<TPlayer extends Player> = TPlayer["position"]
  export type GetInventory<TPlayer extends Player> = TPlayer["inventory"]
  export type GetVisited<TPlayer extends Player> = TPlayer["visited"]

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
    > = Player<{
      history: [...TPlayer["history"], GetRoomAtLocation<TLocation>],
      location: TLocation,
      inventory: TPlayer["inventory"],
      visited: TPlayer["visited"] & { 
        [Key in `${GetX<TLocation>},${GetY<TLocation>}`]: true
      }
    }>

    /**
     * Adds a message to the players history, this can be used for providing feedback to the player
     * regarding an action they have attempted to taken. This is generally used for invalid actions
     */
    export type PushMessage<
      TPlayer extends Player, 
      TMessage extends Message
    > = Player<{
      history: [...TPlayer["history"], TMessage],
      location: TPlayer["position"],
      inventory: TPlayer["inventory"],
      visited: TPlayer["visited"]
    }>

    /**
     * Indicates whether or not the player has visited a specified location
     */
    export type HasVisited<
      TPlayer extends Player, 
      TLocation extends Location
    > = 
      TLocation extends [infer X extends number, infer Y extends number]
        ? `${X},${Y}` extends keyof TPlayer["visited"] 
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
        GetXFromEntity<TPlayer>, 
        GetYFromEntity<TPlayer>
      ]>[TDirection]

  }

}