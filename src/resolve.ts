import type { Constants, Printer } from "./print";
import type { Shift, ShiftUntil, TuplifyUnion } from "./helper";
import type { Int } from "./helpers/maths";
import type { DIRECTION, Message, Player, Room } from "./location"

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
export type GetMessageFromData<First> = 
  First extends Room 
    ? First['name'] :
  First extends Message
    ? ResolveResponse<First> :
  "GET_MESSAGE_FROM_DATA_ERROR"

type DID_NOT_RESOLVE_MESSAGE = "DID_NOT_RESOLVE_MESSAGE"







export type ResolveResponse<TData> =
  TData extends Message ?
    TData extends ResolveMessages.MapBoundaryPreventsNavigation<DIRECTION> 
      ? ResolveMessages.ResolveMapBoundaryPreventsNavigation<TData> :
    TData extends ResolveMessages.NoPathPresent<DIRECTION>
      ? ResolveMessages.ResolveNoPathPresent<TData> :
    TData extends ResolveMessages.InventoryIsEmpty
      ? ResolveMessages.ResolveInventoryIsEmpty<TData> :
    TData extends ResolveMessages.InventoryContainsItems<Record<string, any>>
      ? ResolveMessages.ResolveInventoryItems<TData> :
    DID_NOT_RESOLVE_MESSAGE :
  TData extends Room
    ? TData :
  'RESOLVE_RESPONSE_ERROR'

type DirectionToString<TRoom extends Room, TDirection extends DIRECTION> = 
  TDirection extends 'north'
    ? TRoom['north'] extends true ? 'north' : "" :
  TDirection extends 'south'
    ? TRoom['south'] extends true ? 'south' : "" :
  TDirection extends 'east'
    ? TRoom['east'] extends true ? 'east' : "" :
  TDirection extends 'west'
    ? TRoom['west'] extends true ? 'west' : "" :
  never

type SomeAreNotEmpty<T extends Array<string>, TCount extends number = 0> =
  T extends [] 
    ? TCount extends 0 ? false : true 
    : T[0] extends "" 
      ? SomeAreNotEmpty<Shift<T>, TCount>
      : TCount extends 0 ? true : false

type SimplifyDirections<N extends string, S extends string, E extends string, W extends string> =
  `${
    SomeAreNotEmpty<[S, E, W]> extends true ? N extends "" ? "" : `${N}, ` : N
  }${
    SomeAreNotEmpty<[E, W]> extends true ? S extends "" ? "" : `${S}, ` : S
  }${
    SomeAreNotEmpty<[W]> extends true ? E extends "" ? "" : `${E}, ` : E
  }${
    W
  }`

type DisplayUserNavigationOptions<TRoom extends Room> =
  SimplifyDirections<
    DirectionToString<TRoom, 'north'>,
    DirectionToString<TRoom, 'south'>,
    DirectionToString<TRoom, 'east'>,
    DirectionToString<TRoom, 'west'>
  >



/**
 * Type that should only be run on the final object in history to provide the user with a list
 * of potential actions they can take
 */
type ResolveFinalActions<TPlayer extends Player> =
  ResolveData<TPlayer> extends [infer Current]
    ? Current extends Room
      ? `[Current]\n\nAfter your previous actions, you stand in a ${Current['name']}. You can perform one of the following actions \n - [Navigate]: ${DisplayUserNavigationOptions<Current>}\n - [Action]: Check your inventory ('inventory')` 
      : "RESOLVE_POTENTIAL_ACTIONS_ERROR"
    : never




type ResolveMessage<TData> = TData extends Message ? ResolveResponse<TData> : "RESOLVE_MESSAGE_ERROR"
type ResolveRoom<TPlayer extends Player> = ResolveData<TPlayer> extends [infer Single] ? ResolveFinalActions<TPlayer> : "RESOLVE_ROOM_ERROR: More than one room in history"

type StartMessage<TFirst extends boolean> = TFirst extends true ? "The player starts in a " : ""
type ActionConnectorMessage<TRest extends Array<Room | Message>, TIsFirst extends boolean> = 
  TIsFirst extends true 
    ? " before visiting the following rooms:\n-> " :
  ShouldShortenHistory<TRest, TIsFirst> extends [true, infer SkippedCount extends number] 
    ? `\n-> (${SkippedCount}) ... \n-> ` :
  "\n-> "

/**
 * Takes the player object and converts the _data attribute (history) into a summary of the players actions
 * as well as providing the user with a list of potential actions they can take
 */
export type ResolveHistory<TPlayer extends Player, TFirst extends boolean = true> = 
  ResolveData<TPlayer> extends [] 
    ? Printer.Constant.NewGame : 
  ResolveData<TPlayer> extends [infer First extends Room | Message] 
    ? ResolveLastHistory<TPlayer, First> :
  ResolveData<TPlayer> extends [infer First extends Room | Message, ...infer Rest extends Array<Room | Message>] 
    ? ResolveMultiHistory<TPlayer, TFirst, First, Rest> :
  never

type ResolveLastHistory<
  TPlayer extends Player,
  TFirst extends Room | Message
> =
  ResolveResponse<TFirst> extends Message
    ? ResolveMessage<TFirst> 
    : ResolveRoom<TPlayer>

type ResolveMultiHistory<
  TPlayer extends Player,
  TIsFirst extends boolean,
  TFirst extends Room | Message,
  TRest extends Array<Room | Message>
> =
  `${
    Printer.Conditional.ChainResolve<[
      [TIsFirst, "The player starts in a "],
      [true, GetMessageFromData<TFirst>],
      [true, ActionConnectorMessage<TRest, TIsFirst>]
    ]>
  }${
    // Recursively resolve the history
    ResolveHistory<
      Player<
        TRest extends Array<Room | Message> 
          ? ShouldShortenHistory<TRest, TIsFirst> extends [true, infer _] 
            ? ShiftUntil<TRest, 4> 
            : TRest
          : never, 
        TPlayer['_location'], 
        TPlayer['_inventory'], 
        TPlayer['_visited']
      >,
      false
    >  
  }`

/**
 * Note, similar to other functions relating to math, cannot exceed 999
 */
type ShouldShortenHistory<TData extends Array<Room | Message>, TIsFirst extends boolean, TAmount extends number = 0> = 
  TIsFirst extends true 
    ? [false, TAmount] :
  TData['length'] extends 1 | 0 // handle less than displayable
    ? [false, TAmount] :
  TData['length'] extends Constants.DisplayableHistory // do not shorten if it is displable
    ? [false, TAmount] :
  TData['length'] extends Constants.DisplayableHistoryPlusOne // should shorten if more than 
    ? [true, TAmount] : 
  ShouldShortenHistory<Shift<TData>, TIsFirst, Int.Add<TAmount, 1>> // recursively check if we should shorten
