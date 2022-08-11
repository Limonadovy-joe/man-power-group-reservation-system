import D from "io-ts/Decoder";
import E from "io-ts/Encoder";
import IO from "fp-ts/IO";
import TE from "fp-ts/TaskEither";
import { pipe, flow, identity } from "fp-ts/function";
import * as S from "io-ts/Schema";
import * as C from "io-ts/Codec";
import {
  Either,
  fromPredicate as eitherFromPredicate,
  toError,
  mapLeft as eitherMapLeft,
  chain as eitherChain,
} from "fp-ts/lib/Either";

import {
  TypeOf,
  OutputOf,
  intersection,
  string,
  Branded,
  brand,
  type,
  Type,
  Errors,
  failure as validationFailure,
  Context,
} from "io-ts";

import { NanoId, isURL } from "types";

interface TrimmedStringBrand {
  readonly TrimmedString: unique symbol;
}

type TrimmedString = Branded<string, TrimmedStringBrand>;

type Effect<E, S> = Either<E, S>;

type ValidationContext = { value: unknown; context: Context };

//  custom type guard to narrow the TrimmedString
const isTrimmedString = (s: unknown): s is TrimmedString =>
  typeof s === "string" && s.length === s.trim().length;
const createTrimmedString = (s: string): Effect<Error, TrimmedString> =>
  pipe(s, eitherFromPredicate(isTrimmedString, toError));

const mapErrorToIOErrors =
  ({ value, context }: ValidationContext) =>
  ({ message }: Error): Errors =>
    [{ value, context, message }];

const TrimmedString = new Type<TrimmedString, string, string>(
  "TrimmedString",
  isTrimmedString,
  (value, context) =>
    pipe(
      value,
      createTrimmedString,
      eitherMapLeft(mapErrorToIOErrors({ value, context }))
    ),
  identity
);

//  TODO
//  encode method - examine trimmed string

type ClientId = TypeOf<typeof ClientId>;

const ClientId = intersection([string, NanoId], "ClientId");

interface DomainBrand {
  readonly Domain: unique symbol;
}

type Domain = TypeOf<typeof Domain>;

const Domain = brand(
  string,
  (a): a is Branded<string, DomainBrand> => isURL(a),
  "Domain"
);

type ClientName = TypeOf<typeof ClientName>;
const ClientName = intersection([ClientId, Domain]);

const AuthConfig = type({ clientId: ClientId, domain: Domain });

type AuthConfig = TypeOf<typeof AuthConfig>;
export type AuthConfigInput = OutputOf<typeof AuthConfig>;

// export type HTTP = "http:";
// export type HTTPS = "https:";
// export type UrlProtocol = HTTP | HTTPS;
// export type ValidUrlProtocols = [HTTP, HTTPS];

// export type Data = unknown;
// export type User = Record<string, unknown>;

// export type AsyncFailFunction<I, E, S> = (input: I) => TE.TaskEither<E, S>;

// export interface ProviderAuth<D extends Data, U extends User, E extends Error> {
//   key?: string;
//   login: AsyncFailFunction<D, E, U>;
//   register: AsyncFailFunction<D, E, U>;
//   logout: (returnTo?: string) => IO.IO<void>;
//   loadUser: AsyncFailFunction<D, E, U>;
// }

// // export interface AuthConfig {
// //   domain: Domain;
// //   clientId: ClientId;
// // }

// // export interface AuthConfigUnknown {
// //   domain: unknown;
// //   clientId: unknown;
// // }

// //  useProviderAuth - config and state
// //  useAuthConfig - creates config
// //  useProviderAuthState - creates state
