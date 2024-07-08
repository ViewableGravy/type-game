import type { AddMessageToHistory, Player } from "../location"
import type { ResolveMessages } from "../resolve"

type HasAtLeastOneKey<T> = keyof T extends never ? false : true;
type PlayerHasInventory<TPlayer extends Player> = HasAtLeastOneKey<TPlayer['_inventory']>

export type HandleInventory<TPlayer extends Player> =
  PlayerHasInventory<TPlayer> extends false
    ?  AddMessageToHistory<TPlayer, ResolveMessages.InventoryIsEmpty>
    :  AddMessageToHistory<TPlayer, ResolveMessages.InventoryContainsItems<TPlayer['_inventory']>>