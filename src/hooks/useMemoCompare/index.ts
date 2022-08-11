import { useRef, useEffect } from "react";
import * as IO from "fp-ts/IO";
import * as EQ from "fp-ts/Eq";
import { flow, pipe } from "fp-ts/function";
import { getValuefromIO } from "../../utils/";

type ObjectRef<A> = A | IO.IO<A>;
export const useMemoCompare = <A>(object: ObjectRef<A>, objectEq: EQ.Eq<A>) => {
  const objNext = getValuefromIO(object);
  const refPrev = useRef<A>(objNext);
  const objPrev = refPrev.current;

  const equalReferencies = (objPrev: A | undefined, objNext: A) =>
    typeof objPrev !== "undefined" && objectEq.equals(objPrev, objNext);

  const isEqual = equalReferencies(objPrev, objNext);

  useEffect(() => {
    if (!isEqual) {
      refPrev.current = objNext;
    }
  });

  return isEqual ? objPrev : objNext;
};
