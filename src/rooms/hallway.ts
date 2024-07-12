/***** HALLWAY *****/
export type HallwayProps<
  N extends boolean = false, 
  S extends boolean = false, 
  E extends boolean = false, 
  W extends boolean = false
> = {
  north?: N;
  south?: S;
  east?: E;
  west?: W;
};

export type Hallway<
  N extends boolean = false, 
  S extends boolean = false, 
  E extends boolean = false, 
  W extends boolean = false,
  _ID extends string = "default"
> = {
  type: "hallway";
  name: "hallway";
  north: N;
  south: S;
  east: E;
  west: W;

  /**
   * Identifier used for troubleshooting
   */
  _id: _ID;
};