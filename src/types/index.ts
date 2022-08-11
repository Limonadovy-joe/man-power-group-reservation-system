import { pipe } from "fp-ts/function";
import { fromNullableK as OptionFromNullableK, isSome } from "fp-ts/Option";
import { IO } from "fp-ts/IO";
import { brand, Branded, string } from "io-ts";

/**
 * General types
 *
 * These types will be used in Domain entities that will not be runtime validated.
 */
export type InitialState<A> = A | IO<A>;
export type PrimitiveValues = string | number | boolean | bigint;
export type ReferenceValues = Record<string, unknown> | Array<unknown>;

/**
 * Branded types
 *
 *  They should be created only using smart constructors, otherwise a user could bypass the constrain of construction.
 */

export interface NanoIdBrand {
  readonly NanoId: unique symbol;
}

export const NanoId = brand(
  string,
  (s): s is Branded<string, NanoIdBrand> => s.length <= 21,
  "NanoId"
);

export type NanoId = string & NanoIdBrand;

/**
 * I18n
 *
 */

/**
 * Languages
 * Represents language codes by ISO 639 form.
 * @category I18n
 */
type Languages = "cz" | "en" | "de";

/**
 * Countries
 * Represents countries codes by ISO 639 form.
 * @category I18n
 */
type Countries = "CZ" | "US" | "GB" | "DE";

/**
 * LocaleStructure
 * Represents structure of languages and countries codes.
 * LocaleStructure should not be used on non-validated codes.
 * @category I18n
 */
type LocaleStructure<LC extends string, CC extends string> = `${LC}-${CC}`;

/**
 * ParserLocalCodes
 * Parses languages and countries codes from arbitrary string
 * @category I18n
 */
type ParserLocalCodes<
  LC extends string,
  CC extends string
> = LC extends Languages
  ? CC extends Countries
    ? LocaleStructure<LC, CC>
    : never
  : never;

/**
 * Locale
 * Represents languages and countries codes seperated by hyphen in the following format: `'langCode-countryCode'`
 * `langCode` - lower case code of language
 * `countryCode` - upper case code of country
 *
 * @example
 * ```ts
 * type LocaleDE1 = Locale<"de">; // never
 * type LocaleDE2 = Locale<"de-de">; // never
 * type LocaleDE3 = Locale<"de-DE">; // correct = "de-DE"
 * ```
 * @category I18n
 */
export type Locale<S extends string> = S extends `${infer LC}-${infer CC}`
  ? ParserLocalCodes<LC, CC>
  : never;

/**
 * Locales
 * Represents languages and countries codes in dictionary object.
 * @category I18n
 */
export type Locales = {
  ENGLISH: { US: Locale<"en-US"> } | { GB: Locale<"en-GB"> };
  GERMAN: Locale<"de-DE">;
  CZECH: Locale<"cz-CZ">;
};

type VersionChar = "1" | "2" | "3" | "4" | "5";

type Char =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f";

/**
 * Utils
 *
 */

type Prev<X extends number> = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  ...never[]
][X];

type S = Prev<12>;

type HasLength<S extends string, Len extends number> = [Len] extends [0]
  ? S extends ""
    ? true
    : never
  : S extends `${infer C}${infer Rest}`
  ? Lowercase<C> extends Char
    ? Rest
    : never
  : never;

type P = HasLength<"17de70fc", 11>;
