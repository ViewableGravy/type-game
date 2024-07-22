import type { MapInstance } from "..";
import type { Game } from "../game";
import type { Int } from "../helpers/maths";
import type { Player, DIRECTION, Location } from "../player"
import type { ResolveMessages } from "../resolve";


export type GetY<TLocation extends Location> = TLocation[1]
export type GetX<TLocation extends Location> = TLocation[0]

export type GetYFromPlayer<TGame extends Game> = GetY<
  Player.GetCurrentLocation<
    Game.GetPlayer<TGame>
  >
>

export type GetXFromPlayer<TGame extends Game> = GetX<
  Player.GetCurrentLocation<
    Game.GetPlayer<TGame>
  >
>

export type GetRoomAtLocation<TGame extends Game, TLocation extends Location> = Game.GetMap<TGame>[GetY<TLocation>][GetX<TLocation>]

type HandleNorth<TGame extends Game> =
  Player.Navigate.Can<TGame, "north"> extends false 
    ? Player.SetDebug<TGame, ResolveMessages.NoPathPresent<"north">> : 
  GetYFromPlayer<TGame> extends 0
    ? Player.SetDebug<TGame, ResolveMessages.MapBoundaryPreventsNavigation<"north">> : 
  Player.History.Visit<TGame, [
    GetXFromPlayer<TGame>, 
    Int.Sub<GetYFromPlayer<TGame>, 1>
  ]>

type HandleSouth<TGame extends Game> =
  Player.Navigate.Can<TGame, "south"> extends false 
    ? Player.SetDebug<TGame, ResolveMessages.NoPathPresent<"south">> : 
  GetYFromPlayer<TGame> extends Int.Sub<MapInstance['length'], 1>
    ? Player.SetDebug<TGame, ResolveMessages.MapBoundaryPreventsNavigation<"south">> : 
  Player.History.Visit<TGame, [
    GetXFromPlayer<TGame>, 
    Int.Add<GetYFromPlayer<TGame>, 1>
  ]>

type HandleEast<TGame extends Game> =
  Player.Navigate.Can<TGame, "east"> extends false 
    ? Player.SetDebug<TGame, ResolveMessages.NoPathPresent<"east">> : 
  GetXFromPlayer<TGame> extends Int.Sub<MapInstance[0]['length'], 1>
    ? Player.SetDebug<TGame, ResolveMessages.MapBoundaryPreventsNavigation<"east">> : 
  Player.History.Visit<TGame, [
    Int.Add<GetXFromPlayer<TGame>, 1>, 
    GetYFromPlayer<TGame>
  ]>

type HandleWest<TGame extends Game> =
  Player.Navigate.Can<TGame, "west"> extends false 
    ? Player.SetDebug<TGame, ResolveMessages.NoPathPresent<"west">> : 
  GetXFromPlayer<TGame> extends 0
    ? Player.SetDebug<TGame, ResolveMessages.MapBoundaryPreventsNavigation<"west">> : 
  Player.History.Visit<TGame, [
    Int.Sub<GetXFromPlayer<TGame>, 1>, 
    GetYFromPlayer<TGame>
  ]>

export type NavigatePlayer<TGame extends Game, TDirection extends DIRECTION> = 
  TDirection extends "north" ? HandleNorth<TGame> :
  TDirection extends "south" ? HandleSouth<TGame> :
  TDirection extends "east" ? HandleEast<TGame> :
  TDirection extends "west" ? HandleWest<TGame> :
  Player