import { useReducer, Reducer, ReducerState } from "react";
import { NavigateFunction } from "react-router-dom";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { nanoid } from "nanoid";
import { pipe, flow, identity } from "fp-ts/function";

import {
  Data,
  User,
  AuthConfig,
  ClientId,
  Domain,
  AuthConfigUnknown,
} from "../types";
import { authConfig } from "../utils";
import { AUTH_CONFIG_DEFAULT } from "../config";

interface UseProviderAuthStateParams {
  config?: AuthConfigUnknown;
}

type IDLE = "IDLE";
type LOADING = "PENDING";
type SUCCESS = "SUCCESS";
type FAIL = "FAIL";
type AuthStatus = IDLE | LOADING | SUCCESS | FAIL;

interface AuthState<U extends User, E extends Error> {
  user: E.Either<E, O.Option<U>>;
  status: AuthStatus;
  errors: Record<string, Error>;
  config: AuthConfig;
}

//  Flux standart actions type: domain/eventName
type Action<U extends User, E extends Error> =
  | { type: "auth/saveUser"; payload: U }
  | { type: "auth/saveError"; payload: E }
  | { type: "auth/updateStatus"; payload: AuthStatus }
  | { type: "auth/saveConfig"; payload: AuthConfig }
  | { type: "auth/reset" };

//  useProviderAuth - config and state
//  useProviderAuthState - creates state

//  TODO
//  Either with option
//  remoteData
//  reader - iniAuthState - Deps {validator, default config}

const p = {
  clientId: nanoid() as ClientId,
  domain: "http://localhost:3000/" as Domain,
};

type RemoteData<U extends User, E extends Error> =
  | { error: O.Option<E> }
  | { user: O.Option<U> };

interface InitAuthStateDependencies {
  decoder: typeof authConfig;
  config: AuthConfig;
}

const initAuthConfig =
  (u: AuthConfigUnknown) =>
  ({ decoder, config }: InitAuthStateDependencies): AuthConfig =>
    pipe(
      u,
      decoder.decode,
      E.fold((_): AuthConfig => config, identity)
    );

const initAuthState =
  (u: AuthConfigUnknown) =>
  (deps: InitAuthStateDependencies): AuthState<User, Error> => ({
    status: "IDLE",
    user: E.right(O.none),
    config: initAuthConfig(u)(deps),
    errors: {},
  });

// const providerAuthReducer: Reducer<
//   AuthState<User, Error>,
//   Action<User, Error>
// > = (state, action) => {
//   switch (action.type) {
//     case "auth/reset":
//       return {};
//   }
// };

const useProviderAuthState = <D extends Data, U extends User, E extends Error>({
  config,
}: UseProviderAuthStateParams) => {
  
  //  TODO
  // refactor
  const configDefault = config ?? { clientId: "", domain: "" };
  const initState = flow(initAuthState)(configDefault)({
    decoder: authConfig,
    config: AUTH_CONFIG_DEFAULT,
  });

  const state = useReducer();
};
