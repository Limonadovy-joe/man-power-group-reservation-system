import * as D from "io-ts/Decoder";
import { pipe } from "fp-ts/function";
import { fromNullableK as OptionFromNullableK, isSome } from "fp-ts/Option";
import { IO } from "fp-ts/IO";
import { brand, Branded, string } from "io-ts";

import { Locale } from "../types";

/**
 * i18n
 */

//  TODO
/**
 * Creates a locale
 * @param str string that must follow `Locale` type constrains
 */
const createLocale = <S extends string>(str: string): Locale<S> =>
  str as Locale<S>;

const LOCALE_DE = createLocale("cs-CZ");

//  TODO
//  refactor isUrl to work without outside dependecies
const URL_REGEX = /^(https):\/\/[^ "]+$/;

export const isURL = (url: string) =>
  pipe(
    url.match(URL_REGEX),
    OptionFromNullableK((res) =>
      !Array.isArray(res) || res.length > 0 ? undefined : res
    ),
    isSome
  );

/**
 * IO Utils
 * @param io
 * @returns
 */
export const _isIO = <A>(io: unknown): io is IO<A> => typeof io === "function";

export const getValuefromIO = <A>(funOrVal: A | IO<A>) =>
  _isIO(funOrVal) ? funOrVal() : funOrVal;

//  Decoders
// export const NanoId: D.Decoder<string, T.NanoId> = pipe(
//   D.string,
//   D.refine((s): s is T.NanoId => s.length <= 21, "NanoId")
// );
