import { nanoid } from "nanoid";

import {
  HTTP,
  HTTPS,
  ValidUrlProtocols,
  ProviderAuthConfig,
  ClientId,
} from "../types";

export const https: HTTPS = "https:";
export const htttp: HTTP = "http:";
export const validUrlProtocols: ValidUrlProtocols = ["http:", "https:"];

export const providerAuthConfigDefault = {
  clientId: nanoid(),
  domain: "http://localhost:3000/",
};
