import type { Player } from "../entities/player";
import type { ResolveMessages } from "../_resolve"

type HasAtLeastOneKey<T> = keyof T extends never ? false : true;
type PlayerHasInventory<TPlayer extends Player> = HasAtLeastOneKey<TPlayer['inventory']>

export type HandleInventory<TPlayer extends Player> =
  PlayerHasInventory<TPlayer> extends false
    ?  Player.History.PushMessage<TPlayer, ResolveMessages.InventoryIsEmpty>
    :  Player.History.PushMessage<TPlayer, ResolveMessages.InventoryContainsItems<TPlayer['inventory']>>