import React from "react";
import * as D from "io-ts/Decoder";
import * as EN from "io-ts/Encoder";
import IO from "fp-ts/IO";
import TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import { pipe, flow } from "fp-ts/function";

import { validUrlProtocols } from "../config";
import { AuthConfig, ClientId, Domain, ValidUrlProtocols } from "../types";
import { NanoId } from "utils";

const createUrl = (s: string) => new URL(s);
const createErrorFromUnknown = (u: unknown) =>
  u instanceof Error ? u : new Error("unknown error");

const includes =
  <A>(elem: A) =>
  (arr: A[]) =>
    arr.includes(elem);

const isValidUrlProtocol =
  (protocol: string) => (protocols: ValidUrlProtocols) =>
    includes(protocol)(protocols);

const validateUrl = (url: string) => (protocols: ValidUrlProtocols) =>
  pipe(
    url,
    E.tryCatchK(createUrl, createErrorFromUnknown),
    E.chain(({ protocol }) =>
      pipe(
        protocols,
        E.fromPredicate(
          flow(isValidUrlProtocol(protocol)),
          (validProtocols) =>
            new Error(
              `Provided ${protocol} does not have the same format as protocols ${validProtocols.join(
                " , "
              )}`
            )
        ),
        E.map((_) => protocol)
      )
    )
  );

const isValidUrl = (url: string) => (protocols: ValidUrlProtocols) =>
  pipe(
    protocols,
    validateUrl(url),
    E.fold(
      () => false,
      (_) => true
    )
  );

//  Brandend types - decoders
const createDomain = (protocols: ValidUrlProtocols) =>
  pipe(
    D.string,
    D.refine((s): s is Domain => isValidUrl(s)(protocols), "domain")
  );

export const domain = createDomain(validUrlProtocols);

const createClientId = (decoder: typeof NanoId) =>
  pipe(
    D.string,
    D.refine(
      (s): s is ClientId => pipe(s, decoder.decode, E.isRight),
      "clientId"
    )
  );

export const clientId = createClientId(NanoId);

export const authConfig = D.struct<AuthConfig>({
  domain,
  clientId,
});
