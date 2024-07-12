/***** TYPE IMPORTS *****/
import type { Location } from "../_player"

/***** TYPE DEFINITIONS *****/
export type Entity = {
  /**
   * Identifier to narrow the type of the entity.
   */
  type: string,

  /**
   * Whether or not the entity is enabled. Entities that are not enabled will be treated as if they do not exist.
   */
  enabled: boolean,

  /**
   * The location of the entity within the game world. All entities must have a position
   */
  position: Location
}

/***** NAMESPACE START *****/
export namespace Entity {

  /**
   * Extends an entity with additional properties, useful for avoiding interfaces
   */
  export type Extend<TEntity extends Entity, TExtension> = TEntity & TExtension

}
