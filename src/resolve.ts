import type { DIRECTION, Location, Message, Player, Room } from "./location"


export namespace ResolveMessages {

  // Type for a message dictating that the user cannot navigate
  export type MapBoundaryPreventsNavigation<TDirection extends DIRECTION> = 
    `CANNOT_NAVIGATE: Looks like you can't head further ${TDirection} because you are at the ${TDirection} most edge of the map`

  export type ResolveMapBoundaryPreventsNavigation<TCannotNavigate extends string> = 
    TCannotNavigate extends `CANNOT_NAVIGATE: ${infer Message}` ? Message : never
  
  // Type for a message dictating that the user cannot navigate due to no path being present
  export type NoPathPresent<TDirection extends DIRECTION> =
    `NO_PATH: Looks like there is no path to the ${TDirection}`

  export type ResolveNoPathPresent<TCannotNavigate extends string> =
    TCannotNavigate extends `NO_PATH: ${infer Message}` ? Message : never
}


export type ResolveData<TPlayer extends Player> = TPlayer['_data']
export type ResolveRoomName<TPlayer extends Player> = ResolveData<TPlayer>['name']

export type GetNameFromInferredRoom<First extends any> = First extends Room ? First['name'] : never

type SuccessfulAction = "SUCCESS"

export type ResolveResponse<TData extends any> =
  TData extends Room | Message ?
    TData extends ResolveMessages.MapBoundaryPreventsNavigation<DIRECTION> 
      ? ResolveMessages.ResolveMapBoundaryPreventsNavigation<TData> :
    TData extends ResolveMessages.NoPathPresent<DIRECTION>
      ? ResolveMessages.ResolveNoPathPresent<TData> :
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

