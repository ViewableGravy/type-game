
import type { Hallway } from "../rooms/hallway";
import type { CreateMap } from "./map";

// https://gamefaqs.gamespot.com/ds/943642-etrian-odyssey-ii-heroes-of-lagaard/map/5011-01f-dungeon-map

export type MapInstance = CreateMap<[


  [  null, null,                       null,                              null,                              null                             ],


  [  null, Hallway<false, true>,       null,                              Hallway<false, true, true>,        Hallway<false, true, true, true> ],


  [  null, Hallway<true, false, true>, Hallway<false, false, true, true>, Hallway<true, true, true, true>,   Hallway<true, true, true, true>  ],


  [  null, null,                       null,                              Hallway<true, false, true, false>, Hallway<true, true, true, true>  ]


]>
