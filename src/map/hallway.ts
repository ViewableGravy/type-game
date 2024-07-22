
/** HALLWAY */

export type Hallway<
  N extends boolean = false, 
  S extends boolean = false, 
  E extends boolean = false, 
  W extends boolean = false
> = {
  type: "hallway";
  name: "hallway";
  north: N;
  south: S;
  east: E;
  west: W;
};