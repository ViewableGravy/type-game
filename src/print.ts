
export type Printer<T extends string> = T

/**
 * Namespace for printing text from the game. This namespace is a super set of all
 * printing related functionality.
 */
export namespace Printer {
  export namespace Constant {
    export type NewGame = "Game has not started yet"
  }

  /**
   * Namespace for printing text that is conditional.
   */
  export namespace Condition {
    /**
     * Standard pattern for a ConditionalPrintable where the first value represents
     * whether or not the string should be printed, the second value is the string to print
     * and an optional third value to print when the first value is false
      */
    export type ConditionalPrintable = 
      | [shouldPrint: boolean, onTrue: string] 
      | [shouldPrint: boolean, onTrue: string, onFalse: string]
    
    /**
      * Extracts the string to print from a ConditionalPrintable
      */
    export type Resolve<T extends ConditionalPrintable> =
      T extends [true, infer $True extends string]
        ? $True :
      T extends [true, infer $True extends string, infer _]
        ? $True :
      T extends [false, infer _]
        ? "" :
      T extends [false, infer _, infer $False extends string]
        ? $False :
      never
    
    /**
     * Chains together multiple ConditionalPrintables into a single string
     * 
     * TODO: Add support for .join, .append, .prepend of a character
     */
    export type ChainResolve<T extends ConditionalPrintable[]> =
      T extends []
        ? "" :
      T extends [infer First extends ConditionalPrintable]
        ? Resolve<First> :
      T extends [infer First extends ConditionalPrintable, ...infer Rest extends ConditionalPrintable[]]
        ? `${Resolve<First>}${ChainResolve<Rest>}` :
      ""
  }
}

export namespace Constants {
  export type DisplayableHistory = 5;
  export type DisplayableHistoryPlusOne = 6;
}
