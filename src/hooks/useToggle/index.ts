import { useCallback, useState, useEffect } from "react";
import * as IO from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/function";

type IOVoid = IO.IO<void>;

type Identity<A> = (a: A) => A;

type SetStateAction<A> = A | Identity<A>;

interface UseToggleReturnType<A> {
  value: boolean;
  setTrue: IOVoid;
  setFalse: IOVoid;
  setValue: (val: SetStateAction<A>) => IOVoid;
  toggle: IOVoid;
}

export const useToggle = (
  valueDefault = false
): UseToggleReturnType<boolean> => {
  const [value, setterValue] = useState(valueDefault);

  useEffect(() => pipe(valueDefault, setValue)(), [valueDefault]);

  const setTrue = () => setterValue(true);

  const setFalse = () => setterValue(false);

  const toggle = () => setterValue((val) => !val);

  const setValue =
    (val: SetStateAction<boolean>): IO.IO<void> =>
    () =>
      setterValue(val);

  return {
    value,
    setTrue,
    setFalse,
    setValue,
    toggle,
  };
};
