import { useState, useEffect, SetStateAction, useCallback } from "react";
import { useMemoCompare } from "../useMemoCompare";
import * as IO from "fp-ts/IO";
import * as EQ from "fp-ts/Eq";
import { flow, pipe } from "fp-ts/function";
import {
  InitialState,
  PrimitiveValues,
  ReferenceValues,
} from "../../utils/index";

//  First overload is for generic parameter like useStableState<T>() in generic component or hook
export function useStableState<T>(
  initialState: InitialState<T>,
  eqState: EQ.Eq<T>
): readonly [T, (action: SetStateAction<T>) => IO.IO<void>];
export function useStableState<T extends ReferenceValues>(
  initialState: InitialState<T>,
  eqState: EQ.Eq<T>
): readonly [T, (action: SetStateAction<T>) => IO.IO<void>];
export function useStableState<T extends PrimitiveValues>(
  initialState: InitialState<T>,
  eqState?: undefined
): readonly [T, (action: SetStateAction<T>) => IO.IO<void>];
export function useStableState<T>(
  initialState: InitialState<T>,
  eqState = { equals: (x: T, y: T) => x === y }
): readonly [T, (action: SetStateAction<T>) => IO.IO<void>] {
  const [value, setValue] = useState(initialState);
  const valueStableRef = useMemoCompare(initialState, eqState);

  //  memoize function in case we pass down the component
  const setValueIO = useCallback(
    (action: SetStateAction<T>): IO.IO<void> =>
      () =>
        setValue(action),
    []
  );
  //  internal utility function
  const _updateInitialState = flow<
    ReadonlyArray<SetStateAction<T>>,
    IO.IO<SetStateAction<T>>,
    IO.IO<void>
  >(IO.of, IO.chain(setValueIO));

  //  useState does not reload state from props
  //  TODO
  //  this effect calls twice
  useEffect(() => pipe(initialState, _updateInitialState)(), [valueStableRef]);

  return [value, setValueIO];
}

// }
