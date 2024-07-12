import type { Entity } from "../../entities/entity";
import type { Int } from "../../utilities/maths";
import type { DIRECTION, Location, Room } from "../../_player"
import type { ResolveMessages } from "../../_resolve";
import type { Player } from "../../entities/player";
import type { MapInstance } from "../../maps/floor1";
import type { Navigate } from ".";
import type { Game } from "../../game";


export type GetY<TLocation extends Location> = TLocation[1] extends number ? TLocation[1] : never
export type GetX<TLocation extends Location> = TLocation[0] extends number ? TLocation[0] : never

export type GetYFromPlayer<TPlayer extends Player> = GetY<TPlayer["position"]>
export type GetXFromPlayer<TPlayer extends Player> = GetX<TPlayer["position"]>

export type GetYFromEntity<TEntity extends Entity> = GetY<TEntity['position']>
export type GetXFromEntity<TEntity extends Entity> = GetX<TEntity['position']>

export type GetRoomAtLocation<TLocation extends Location> = MapInstance[GetY<TLocation>][GetX<TLocation>] extends Room ? MapInstance[GetY<TLocation>][GetX<TLocation>] : never

type Props = {
  game: Game,
  player: Player,
  direction: DIRECTION
}

type CanPlayerNavigate<T extends Props> =
  Navigate.Can<Omit<T, "player"> & { entity: T['player'] }>

type HandleNorth<T extends Props> =
  CanPlayerNavigate<T> extends false 
    ? Player.History.PushMessage<T['player'], ResolveMessages.NoPathPresent<"north">> : 
  GetYFromPlayer<T['player']> extends 0
    ? Player.History.PushMessage<T['player'], ResolveMessages.MapBoundaryPreventsNavigation<"north">> : 
  Player.History.Visit<T['player'], [
    GetXFromPlayer<T['player']>, 
    Int.Sub<GetYFromPlayer<T['player']>, 1>
  ]>

type HandleSouth<T extends Props> =
  CanPlayerNavigate<T> extends false 
    ? Player.History.PushMessage<T['player'], ResolveMessages.NoPathPresent<"south">> :
  GetYFromPlayer<T['player']> extends Int.Sub<MapInstance['length'], 1>
    ? Player.History.PushMessage<T['player'], ResolveMessages.MapBoundaryPreventsNavigation<"south">> :
  Player.History.Visit<T['player'], [
    GetXFromPlayer<T['player']>, 
    Int.Add<GetYFromPlayer<T['player']>, 1>
  ]>

type HandleEast<T extends Props> =
  CanPlayerNavigate<T> extends false 
    ? Player.History.PushMessage<T['player'], ResolveMessages.NoPathPresent<"east">> :
  GetXFromPlayer<T['player']> extends Int.Sub<MapInstance[0]['length'], 1>
    ? Player.History.PushMessage<T['player'], ResolveMessages.MapBoundaryPreventsNavigation<"east">> :
  Player.History.Visit<T['player'], [
    Int.Add<GetXFromPlayer<T['player']>, 1>, 
    GetYFromPlayer<T['player']>
  ]>

type HandleWest<T extends Props> =
  CanPlayerNavigate<T> extends false 
    ? Player.History.PushMessage<T['player'], ResolveMessages.NoPathPresent<"west">> :
  GetXFromPlayer<T['player']> extends 0
    ? Player.History.PushMessage<T['player'], ResolveMessages.MapBoundaryPreventsNavigation<"west">> :
  Player.History.Visit<T['player'], [
    Int.Sub<GetXFromPlayer<T['player']>, 1>, 
    GetYFromPlayer<T['player']>
  ]>

export type NavigatePlayer<T extends Props> = 
  T['direction'] extends "north" ? HandleNorth<T> :
  T['direction'] extends "south" ? HandleSouth<T> :
  T['direction'] extends "east" ? HandleEast<T> :
  T['direction'] extends "west" ? HandleWest<T> :
  Player