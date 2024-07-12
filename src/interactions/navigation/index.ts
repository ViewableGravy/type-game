/***** TYPE IMPORTS *****/
import type { DIRECTION } from "../../_player";
import type { Entity } from "../../entities/entity";
import type { Game } from "../../game";
import type { GetRoomAtLocation, GetXFromEntity, GetYFromEntity } from "./direction";

/**
 * Namespace relating to entity navigation
 */
export namespace Navigate {
  export type Can<T extends {
    game: Game,
    entity: Entity
    direction: DIRECTION
  }> =
    GetRoomAtLocation<[
      GetXFromEntity<T['entity']>, 
      GetYFromEntity<T['entity']>
    ]>[T['direction']]
}