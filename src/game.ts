import type { _Action, _ChainActions } from "./handlers/action"
import type { ACTION, Player, Room } from "./player"

type GameInitializationObject = {
  map: Array<Array<Room>>,
  player: Player
}

type Game<TInitializer extends GameInitializationObject = any> = {
  "map": TInitializer['map'],
  "player": TInitializer['player']
} 

export namespace Game {

  export type Create<TInitializer extends GameInitializationObject> = Game<TInitializer>
  export type GetPlayer<TGame extends Game> = TGame["player"]
  export type GetMap<TGame extends Game> = TGame["map"]

  /**
   * Functionality relating to trigger actions in the game. For now this is player actions,
   * But could also potentially include actions relating to enemies in the future.
   */
  export namespace Action {

    export type PlayerAction<TGame extends Game, TAction extends ACTION> = 
      Game<{
        map: Game.GetMap<TGame>,
        player: _Action<Game.GetPlayer<TGame>, TAction>
      }>

    export type ChainPlayerActions<TGame extends Game, TActions extends Array<ACTION>> =
      Game<{
        map: Game.GetMap<TGame>,
        player: _ChainActions<Game.GetPlayer<TGame>, TActions>
      }>

  }
}