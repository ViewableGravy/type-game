import type { Player } from "../entities/player";
import type { Shift } from "../utilities/common";
import type { ACTION, DIRECTION } from "../_player";
import type { NavigatePlayer } from "../interactions/navigation/direction";
import type { HandleInventory } from "./inventory";
import type { Game } from "../game";

type Props<TAction = ACTION> = {
  game: Game,
  player: Player,
  action: TAction
}

type CastToNavigateProps<T extends Props> =
  T['action'] extends DIRECTION
    ? Omit<T, 'action'> & { direction: T['action'] }
    : never

export type _Action<T extends Props> =
  T['action'] extends DIRECTION 
    ? NavigatePlayer<CastToNavigateProps<T>> : 
  T['action'] extends "inventory" 
    ? HandleInventory<T['player']> :
  T['player']

export type _ChainActions<T extends Props<Array<ACTION>>> =
  T['action'] extends []
    ? T['player']
    : _ChainActions<{
        game: T['game'],
        action: Shift<T['action']>,
        player: _Action<{
          game: T['game'],
          player: T['player'],
          action: T['action'][0]
        }>
    }>