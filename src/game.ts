import type { Player } from "./entities/player"
import type { _Action, _ChainActions } from "./handlers/action"
import type { ACTION, Room } from "./_player"

type GameInitializationObject = {
  map: Array<Array<Room | null>>,
  player: Player,
  entities?: any
}

export type Game<TInitializer extends GameInitializationObject = any> = {
  "map": TInitializer['map'],
  "player": TInitializer['player'],
  "entities"?: TInitializer['entities']
} 

export namespace Game {

  export type Create<TInitializer extends GameInitializationObject> = Game<TInitializer>
  export type GetPlayer<TGame extends Game> = TGame["player"]
  export type GetMap<TGame extends Game> = TGame["map"]
  export type GetEntities<TGame extends Game> = TGame["entities"]

  /**
   * Functionality relating to trigger actions in the game. For now this is player actions,
   * But could also potentially include actions relating to enemies in the future.
   */
  export namespace Action {

    export type PlayerAction<TGame extends Game, TAction extends ACTION> = 
      Game<{
        map: Game.GetMap<TGame>,
        player: _Action<{ 
          player: Game.GetPlayer<TGame>, 
          action: TAction, 
          game: TGame 
        }>,
        entities: Game.GetEntities<TGame>
      }>

    export type ChainPlayerActions<TGame extends Game, TActions extends Array<ACTION>> =
      Game<{
        map: Game.GetMap<TGame>,
        player: _ChainActions<{
          player: Game.GetPlayer<TGame>,
          action: TActions,
          game: TGame
        }>,
        entities: Game.GetEntities<TGame>
      }>

  }
}