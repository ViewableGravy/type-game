import type { Map } from "..";
import type { Int } from "../helpers/maths";
import type { Player, DIRECTION, Location } from "../location"
import type { ResolveMessages } from "../resolve";


export type GetY<TLocation extends Location> = TLocation[1]
export type GetX<TLocation extends Location> = TLocation[0]

export type GetYFromPlayer<TPlayer extends Player> = GetY<TPlayer["_location"]>
export type GetXFromPlayer<TPlayer extends Player> = GetX<TPlayer["_location"]>

export type GetRoomAtLocation<TLocation extends Location> = Map[GetY<TLocation>][GetX<TLocation>]

type HandleNorth<TPlayer extends Player> =
  Player.Navigate.Can<TPlayer, "north"> extends false 
    ? Player.History.PushMessage<TPlayer, ResolveMessages.NoPathPresent<"north">> : 
  GetYFromPlayer<TPlayer> extends 0
    ? Player.History.PushMessage<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"north">> : 
  Player.History.Visit<TPlayer, [
    GetXFromPlayer<TPlayer>, 
    Int.Sub<GetYFromPlayer<TPlayer>, 1>
  ]>

type HandleSouth<TPlayer extends Player> =
  Player.Navigate.Can<TPlayer, "south"> extends false 
    ? Player.History.PushMessage<TPlayer, ResolveMessages.NoPathPresent<"south">> : 
  GetYFromPlayer<TPlayer> extends Int.Sub<Map['length'], 1>
    ? Player.History.PushMessage<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"south">> : 
  Player.History.Visit<TPlayer, [
    GetXFromPlayer<TPlayer>, 
    Int.Add<GetYFromPlayer<TPlayer>, 1>
  ]>

type HandleEast<TPlayer extends Player> =
  Player.Navigate.Can<TPlayer, "east"> extends false 
    ? Player.History.PushMessage<TPlayer, ResolveMessages.NoPathPresent<"east">> : 
  GetXFromPlayer<TPlayer> extends Int.Sub<Map[0]['length'], 1>
    ? Player.History.PushMessage<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"east">> : 
  Player.History.Visit<TPlayer, [
    Int.Add<GetXFromPlayer<TPlayer>, 1>, 
    GetYFromPlayer<TPlayer>
  ]>

type HandleWest<TPlayer extends Player> =
  Player.Navigate.Can<TPlayer, "west"> extends false 
    ? Player.History.PushMessage<TPlayer, ResolveMessages.NoPathPresent<"west">> : 
  GetXFromPlayer<TPlayer> extends 0
    ? Player.History.PushMessage<TPlayer, ResolveMessages.MapBoundaryPreventsNavigation<"west">> : 
  Player.History.Visit<TPlayer, [
    Int.Sub<GetXFromPlayer<TPlayer>, 1>, 
    GetYFromPlayer<TPlayer>
  ]>

export type Navigate<TPlayer extends Player, TDirection extends DIRECTION> = 
  TDirection extends "north" ? HandleNorth<TPlayer> :
  TDirection extends "south" ? HandleSouth<TPlayer> :
  TDirection extends "east" ? HandleEast<TPlayer> :
  TDirection extends "west" ? HandleWest<TPlayer> :
  Player