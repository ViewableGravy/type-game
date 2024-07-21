/***** HALLWAY *****/
export type HallwayProps<
  N extends boolean | undefined = undefined, 
  S extends boolean | undefined = undefined, 
  E extends boolean | undefined = undefined, 
  W extends boolean | undefined = undefined
> = {
  north?: N;
  south?: S;
  east?: E;
  west?: W;
};

export type Hallway<
  N extends boolean | undefined = undefined, 
  S extends boolean | undefined = undefined, 
  E extends boolean | undefined = undefined, 
  W extends boolean | undefined = undefined,
  _ID extends string = "default"
> = {
  type: "hallway";
  name: "hallway";
  north: N extends undefined | false ? false : true;
  south: S extends undefined | false ? false : true;
  east: E extends undefined | false ? false : true;
  west: W extends undefined | false ? false : true;

  /**
   * Identifier used for troubleshooting
   */
  _id: _ID;
};