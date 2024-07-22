import type { _PlayerAction, _ChainPlayerActions } from "./handlers/action"
import type { ACTION, Player, Room } from "./player"

type GameInitializationObject = {
  map: Array<Array<Room>>,
  player: Player
}

export type Game<TMap extends Array<Array<Room>> = Array<Array<Room>>, TPlayer extends Player = Player> = {
  "map": TMap,
  "player": TPlayer
} 

export namespace Game {

  export type Create<TMap extends Array<Array<Room>>, TPlayer extends Player> = Game<TMap, TPlayer>
  export type GetPlayer<TGame extends Game> = TGame["player"]
  export type GetMap<TGame extends Game> = TGame["map"]

  export type UpdatePlayer<TGame extends Game, TPlayer extends Player> =
    Game<
      Game.GetMap<TGame>,
      TPlayer
    >

  /**
   * Functionality relating to trigger actions in the game. For now this is player actions,
   * But could also potentially include actions relating to enemies in the future.
   */
  export namespace Action {

    export type PlayerAction<TGame extends Game, TAction extends ACTION> = 
      _PlayerAction<TGame, TAction>

    export type ChainPlayerActions<TGame extends Game, TActions extends Array<ACTION>> =
      Game<
        Game.GetMap<TGame>,
        _ChainPlayerActions<TGame, TActions>
      >

  }
}