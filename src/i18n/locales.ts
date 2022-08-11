import { Locales } from "types";

export const LOCALES: Locales = {
  ENGLISH: { GB: "en-GB", US: "en-US" },
  CZECH: "cz-CZ",
  GERMAN: "de-DE",
};

type P = Locales["ENGLISH"];
