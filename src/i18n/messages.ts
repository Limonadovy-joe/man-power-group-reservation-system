import { type, number } from "io-ts";
import { MessageDescriptor } from "react-intl";

import { LOCALES } from "./locales";
import { Locales } from "types";

const PositiveNumber = type({ id: number });

// TODO
// Create message id from codec type - tuple - ['NonEmptyString', NonEmptyStringCodec]

type S = Locales["ENGLISH"]["US"];

export const messages = {
  [LOCALES.CZECH]: {
    FORM_ERROR: {
      NonEmptyString: {
        id: "NonEmptyString",
        defaultMessage: "{field} nemuze byt prazdne.",
      } as MessageDescriptor,
    },
  },
  [LOCALES.ENGLISH["US"]]: {
    FORM_ERROR: {
      NonEmptyString: {
        id: "NonEmptyString",
        defaultMessage: "{field} can not be empty.",
      } as MessageDescriptor,
    },
  },
};
