import type { Shift } from "../helper";
import type { ACTION, DIRECTION, Player } from "../location";
import type { Navigate } from "./direction";
import type { HandleInventory } from "./inventory";

export type Action<TPlayer extends Player, TAction extends ACTION> =
  TAction extends DIRECTION 
    ? Navigate<TPlayer, TAction> : 
  TAction extends "inventory" 
    ? HandleInventory<TPlayer> :
  TPlayer

export type ChainActions<TPlayer extends Player, TActions extends Array<ACTION>> =
  TActions extends []
    ? TPlayer
    : ChainActions<
        Action<TPlayer, TActions[0]>,
        Shift<TActions>
      >