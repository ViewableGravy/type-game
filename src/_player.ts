import type { GetRoomAtLocation, GetX, GetXFromPlayer, GetY, GetYFromPlayer } from "./interactions/navigation/direction";
import type { _Action, _ChainActions } from "./handlers/action";

export type DIRECTION = "north" | "south" | "east" | "west";

export type ACTION = DIRECTION | "inventory"

export type ROOM_TYPE = "room" | "hallway";
export type RoomName = "bedroom" | "living room" | "kitchen" | "bathroom" | "hallway" 
export type Room = {
  type: ROOM_TYPE;
  name: RoomName;
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};
export type Message = `${string}: ${string}`

export type Location = [x: number, y: number]
export type Inventory = Record<string, any>