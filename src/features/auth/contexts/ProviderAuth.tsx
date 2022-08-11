import React, { useState, FormEventHandler, FormEvent } from "react";
import {
  IO,
  Do as IODo,
  bind as IOBind,
  of as IOOf,
  bindTo as IOBindTo,
} from "fp-ts/IO";

import { pipe } from "fp-ts/lib/function";
import { Type } from "io-ts";

import { TrimmedString } from "../types";

// export interface ProviderAuthProps<
//   D extends Data,
//   U extends User,
//   E extends Error
// > {
//   provider: ProviderAuth<D, U, E>;
//   navigate: NavigateFunction;
//   config?: ProviderAuthConfig;
//   loader?: () => JSX.Element;
//   error?: (e: Error) => JSX.Element;
// }

//  Newsletter example - it will be better to move it in its own module
//  TODO:
//  NewsletterFormState - constructors, validators, pattern matching - fold

type NewsletterFormState = { email: string } | { error: Error };

type NewsletterFormConfig = { onFormSubmit: IO<void> };

type NewsletterFormProps = NewsletterFormConfig & { email: string };

type TrimmedStringCodec = Type<TrimmedString, string, string>;

const newsletterFormStateInit: NewsletterFormState = { email: "" };

type HandlerFormSubmit = (config: {
  codec: TrimmedStringCodec;
  state: NewsletterFormState;
}) => (evt: FormEvent) => void;

type HandlerFormSubmit2 = (config: {
  codec: TrimmedStringCodec;
  state: NewsletterFormState;
}) => (evt: FormEvent) => void;

const NewsletterForm = ({ email, onFormSubmit }: NewsletterFormProps) => {
  const [formState, setFormState] = useState<NewsletterFormState>(
    newsletterFormStateInit
  );

  const setError = (error: Error) => setFormState({ error });
  const setEmail = (email: string) => setFormState({ email });

  const handleFormSubmit: HandlerFormSubmit =
    ({ codec, state }) =>
    (evt) =>
      pipe(
        evt.preventDefault,
        IOOf,
        IOBindTo("preventFormSubmit"),
        IOBind("setFormState", (_) => pipe(IOOf("test")))
      );

  return (
    <div className="wrapper-form">
      <form
        action=""
        className="newsletter-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="email">
          Email:
          <input type="text" className="email-input" id="email" />
        </label>
        <button type="submit">Register email</button>
      </form>
    </div>
  );
};

const Home = () => {
  // const handleNewsletterFormSubmit = ()

  return <NewsletterForm email="" onFormSubmit={} />;
};
