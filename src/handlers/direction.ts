import type { Map } from "..";
import type { GetMinusOne, GetPlusOne } from "../helper";
import type { AddMessageToHistory, DIRECTION, Location, Player, PlayerCanNavigate, VisitLocation } from "../location"
import type { ResolveMessages } from "../resolve";


export type GetY<TLocation extends Location> = TLocation[1]
export type GetX<TLocation extends Location> = TLocation[0]

export type GetYFromPlayer<TPlayer extends Player> = GetY<TPlayer["_location"]>
export type GetXFromPlayer<TPlayer extends Player> = GetX<TPlayer["_location"]>

export type GetRoomAtLocation<TLocation extends Location> = Map[GetY<TLocation>][GetX<TLocation>]

type HandleNorth<TPlayer extends Player> =
  PlayerCanNavigate<TPlayer, "north"> extends false 
    ? AddMessageToHistory<TPlayer, ResolveMessages.NoPathPresent<"north">>
    : GetYFromPlayer<TPlayer> extends 0
      ? AddMessageToHistory<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"north">>
      : VisitLocation<TPlayer, [GetXFromPlayer<TPlayer>, GetMinusOne<GetYFromPlayer<TPlayer>>]>

type HandleSouth<TPlayer extends Player> =
  PlayerCanNavigate<TPlayer, "south"> extends false 
    ? AddMessageToHistory<TPlayer, ResolveMessages.NoPathPresent<"south">>
    : GetYFromPlayer<TPlayer> extends GetMinusOne<Map['length']>
      ? AddMessageToHistory<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"south">>
      : VisitLocation<TPlayer, [GetXFromPlayer<TPlayer>, GetPlusOne<GetYFromPlayer<TPlayer>>]>

type HandleEast<TPlayer extends Player> =
  PlayerCanNavigate<TPlayer, "east"> extends false 
    ? AddMessageToHistory<TPlayer, ResolveMessages.NoPathPresent<"east">>
    : GetXFromPlayer<TPlayer> extends GetMinusOne<Map[0]['length']>
      ? AddMessageToHistory<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"east">>
      : VisitLocation<TPlayer, [GetPlusOne<GetXFromPlayer<TPlayer>>, GetYFromPlayer<TPlayer>]>

type HandleWest<TPlayer extends Player> =
  PlayerCanNavigate<TPlayer, "west"> extends false 
    ? AddMessageToHistory<TPlayer, ResolveMessages.NoPathPresent<"west">>
    : GetXFromPlayer<TPlayer> extends 0
      ? AddMessageToHistory<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"west">>
      : VisitLocation<TPlayer, [GetMinusOne<GetXFromPlayer<TPlayer>>, GetYFromPlayer<TPlayer>]>

export type Navigate<TPlayer extends Player, TDirection extends DIRECTION> = 
  TDirection extends "north" ? HandleNorth<TPlayer> :
  TDirection extends "south" ? HandleSouth<TPlayer> :
  TDirection extends "east" ? HandleEast<TPlayer> :
  TDirection extends "west" ? HandleWest<TPlayer> :
  Player