import type { TuplifyUnion } from "./helper";
import type { DIRECTION, Message, Player, Room } from "./location"

type CreateCommaSeparatedType<T extends string, K extends string = T> = 
 [T] extends [never] 
    ? "" 
    : K extends any 
        ? Exclude<T, K> extends never
            ? `${K}` 
            : `${K},${CreateCommaSeparatedType<Exclude<T, K>>}` 
        : "";

type UnionToCommaSeparated<T extends string> =
  TuplifyUnion<T> extends []
    ? "" :
  TuplifyUnion<T> extends [infer First]
    ? First extends string ? `${First}` : never :
  TuplifyUnion<T> extends [infer First, ...infer Rest]
    ? First extends string ? `${First}, ${UnionToCommaSeparated<Rest[number] extends string ? Rest[number] : never>}` : never :
  never



export namespace ResolveMessages {
  type CANNOT_NAVIGATE = "CANNOT_NAVIGATE"
  type NO_PATH = "NO_PATH"
  type INVENTORY_EMPTY = "INVENTORY_EMPTY"
  type INVENTORY_CONTAINS_ITEMS = "INVENTORY_CONTAINS_ITEMS"

  // Type for a message dictating that the user cannot navigate
  export type MapBoundaryPreventsNavigation<TDirection extends DIRECTION> = 
    `${CANNOT_NAVIGATE}: Looks like you can't head further ${TDirection} because you are at the ${TDirection} most edge of the map`
  
  // Type for a message dictating that the user cannot navigate due to no path being present
  export type NoPathPresent<TDirection extends DIRECTION> =
    `${NO_PATH}: Looks like there is no path to the ${TDirection}`

  // Type for a message dictating that the user's inventory is empty
  export type InventoryIsEmpty = `${INVENTORY_EMPTY}: Your inventory is empty`

  // Type for a message dictating what the user's inventory contains items
  export type InventoryContainsItems<TInventory extends { [Key in string]: any }> =
    keyof TInventory extends string 
      ? `${INVENTORY_CONTAINS_ITEMS}: Your inventory contains the following items: ${UnionToCommaSeparated<keyof TInventory>}`
      : never

  /**
   * Resolves: Resolvers are intended to run when resolving the final message to be displayed to the user,
   * This allows for messages to be stored in the history in an easily parsable manner, and then resolved
   * to a human readable message when needed
   */
  export type ResolveInventoryIsEmpty<TInventoryIsEmpty extends string> =
    TInventoryIsEmpty extends `${INVENTORY_EMPTY}: ${infer Message}` 
      ? Message 
      : never
  export type ResolveInventoryItems<TInventoryContainsItems extends string> =
    TInventoryContainsItems extends `${INVENTORY_CONTAINS_ITEMS}: ${infer Message}` 
      ? Message 
      : never
  export type ResolveMapBoundaryPreventsNavigation<TCannotNavigate extends string> = 
    TCannotNavigate extends `${CANNOT_NAVIGATE}: ${infer Message}` 
      ? Message 
      : never
  export type ResolveNoPathPresent<TCannotNavigate extends string> =
    TCannotNavigate extends `${NO_PATH}: ${infer Message}` 
      ? Message 
      : never
}


export type ResolveData<TPlayer extends Player> = TPlayer['_data']
export type ResolveRoomName<TPlayer extends Player> = ResolveData<TPlayer>['name']
type ResolveInventory<TPlayer extends Player> = TPlayer['_inventory']

export type GetNameFromInferredRoom<First extends any> = First extends Room ? First['name'] : never

type SuccessfulAction = "SUCCESS"


export type ResolveResponse<TData extends any> =
  TData extends Room | Message ?
    TData extends ResolveMessages.MapBoundaryPreventsNavigation<DIRECTION> 
      ? ResolveMessages.ResolveMapBoundaryPreventsNavigation<TData> :
    TData extends ResolveMessages.NoPathPresent<DIRECTION>
      ? ResolveMessages.ResolveNoPathPresent<TData> :
    TData extends ResolveMessages.InventoryIsEmpty
      ? ResolveMessages.ResolveInventoryIsEmpty<TData> :
    TData extends ResolveMessages.InventoryContainsItems<Record<string, any>>
      ? ResolveMessages.ResolveInventoryItems<TData> :
    SuccessfulAction :
  never

export type ResolveHistory<TPlayer extends Player, TFirst extends boolean = true> = 
  ResolveData<TPlayer> extends [] 
    ? "Game Not started" : 
  ResolveData<TPlayer> extends [infer First] 
    ? ResolveResponse<First> extends SuccessfulAction
      ? GetNameFromInferredRoom<First>  
      : ResolveResponse<First> :
  ResolveData<TPlayer> extends [infer First, ...infer Rest] 
    ? ResolveResponse<First> extends SuccessfulAction
      ? `${TFirst extends true ? "The player starts in a " : ""}${GetNameFromInferredRoom<First>} ${TFirst extends true ? "Before taking the following actions:" : "->"} ${
          ResolveHistory<
            Player<
              Rest extends Array<Room | Message> ? Rest : never, 
              TPlayer['_location'], 
              TPlayer['_inventory'], 
              TPlayer['_visited']
            >,
            false
          >
        }`
      : ResolveResponse<First>
    : never

