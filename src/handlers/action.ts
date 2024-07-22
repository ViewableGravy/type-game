import type { Game } from "../game";
import type { Shift } from "../helper";
import type { ACTION, DIRECTION, Player } from "../player";
import type { NavigatePlayer } from "./direction";

/**
 * @returns {Game}
 */
export type _PlayerAction<TGame extends Game, TAction extends ACTION> =
  TAction extends DIRECTION 
    ? NavigatePlayer<TGame, TAction> 
    : TGame

/**
 * @returns {Player}
 */
export type _ChainPlayerActions<TGame extends Game, TActions extends Array<ACTION>> =
  TActions extends []
    ? Game.GetPlayer<TGame>
    : _ChainPlayerActions<
        _PlayerAction<TGame, TActions[0]>,
        Shift<TActions>
      >