import React, { useState, useEffect } from "react";
import {
  Outlet,
  Link,
  LinkProps,
  useParams,
  useSearchParams,
  Route,
  Routes,
  useRoutes,
  useLocation,
} from "react-router-dom";
import { Nav, TestComponent } from "./App2";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as RREC from "fp-ts/ReadonlyRecord";
import * as A from "fp-ts/Array";
import { useTime } from "../../hooks/useTime";
import "./App.scss";

import dice1 from "../../assets/images/1.svg";
import dice2 from "../../assets/images/2.svg";
import dice3 from "../../assets/images/3.svg";
import dice4 from "../../assets/images/4.svg";
import dice5 from "../../assets/images/5.svg";
import dice6 from "../../assets/images/6.svg";
import { pipe, flow, identity, constNull } from "fp-ts/lib/function";
import { useContext } from "react";
import { Predicate } from "fp-ts/lib/Predicate";

const dicesUrls = [dice1, dice2, dice3, dice4, dice5, dice6];
const imagesUrls = [
  "https://source.unsplash.com/WLUHO9A_xik/880x500",
  "https://source.unsplash.com/DA1eGglMmlg/880x500",
  "https://source.unsplash.com/kTxL6le0Wgk/880x500",
  "https://source.unsplash.com/7go5UASxmDY/880x500",
  "https://source.unsplash.com/YmATDIFsCmQ/880x500",
];

const tasks = ["clean", "wash window", "take out garbage"];

const API_ENDPOINT = "https://worldtimeapi.org/api/timezone/";

// type Quote = { id: number; text: string };
// type Person = { id: string; name: string };
// type PersonWithBio = Person & { bio: string };
// type Artist = PersonWithBio & { quotes: Quote[] };

// const people = [
//   {
//     id: "abraham",
//     name: "Abraham Lincoln",
//     bio: "Abraham Lincoln was an American lawyer and statesman who served as the 16th president of the United States from 1861 until his assassination in 1865",
//     quotes: [
//       {
//         id: 0,
//         text: "You can fool all the people some of the time, and some of the people all the time, but you cannot fool all the people all the time.",
//       },
//       {
//         id: 1,
//         text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.",
//       },
//       {
//         id: 2,
//         text: "Government of the people, by the people, for the people, shall not perish from the Earth.",
//       },
//       {
//         id: 3,
//         text: "Sir, my concern is not whether God is on our side; my greatest concern is to be on God's side, for God is always right.",
//       },
//       {
//         id: 4,
//         text: "You cannot escape the responsibility of tomorrow by evading it today.",
//       },
//     ],
//   },
//   {
//     id: "jrr",
//     name: "J.R.R. Tolkien",
//     bio: "John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic, best known as the author of the high fantasy works The Hobbit and The Lord of the Rings",
//     quotes: [
//       { id: 0, text: "Not all those who wander are lost." },
//       {
//         id: 1,
//         text: "Still round the corner, there may wait, a new road or a secret gate.",
//       },
//       {
//         id: 2,
//         text: "Many that live deserve death. And some that die deserve life. Can you give it to them? Then do not be too eager to deal out death in judgement. For even the very wise cannot see all ends.",
//       },
//       {
//         id: 3,
//         text: "The proper study of Man is anything but Man; and the most improper job of any man, even saints (who at any rate were at least unwilling to take it on), is bossing other men. Not one in a million is fit for it, and least of all those who seek the opportunity.",
//       },
//     ],
//   },
//   {
//     id: "jane",
//     name: "Jane Austen",
//     bio: "Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century",
//     quotes: [
//       {
//         id: 0,
//         text: "To sit in the shade on a fine day and look upon verdure is the most perfect refreshment.",
//       },
//       {
//         id: 1,
//         text: "Selfishness must always be forgiven you know, because there is no hope of a cure.",
//       },
//       {
//         id: 2,
//         text: "My idea of good company is the company of clever, well-informed people who have a great deal of conversation; that is what I call good company.",
//       },
//       {
//         id: 3,
//         text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
//       },
//       {
//         id: 4,
//         text: "The power of doing anything with quickness is always prized much by the possessor, and often without any attention to the imperfection of the performance.",
//       },
//     ],
//   },
//   {
//     id: "tyler",
//     name: "Tyler, The Creator",
//     bio: "Tyler Gregory Okonma (born March 6, 1991), better known as Tyler, the Creator, is an American rapper, singer, songwriter, record producer, actor, visual artist, designer and comedian",
//     quotes: [
//       {
//         id: 0,
//         text: "If the world was ending, I think I would grab some Cinnamon Toast Crunch, a bunch of water, and I'd probably just... I'd probably go crazy.",
//       },
//       {
//         id: 1,
//         text: "I want to take Justin Bieber for a month and just lock him up in a cage where we sit and make music. He's one of the most successful people in the world, but his music could be so much tighter.",
//       },
//       { id: 2, text: "I don't really listen to rap; I just like to rap." },
//       {
//         id: 3,
//         text: "Usually, when I'm rappin', I'm creating a big story or a concept song that sounds like a movie to me.",
//       },
//     ],
//   },
// ];

// type People = typeof people;

// //  UI.DEV
// //  Query parameters

// const users = {
//   tyler: {
//     name: "Tyler",
//     handle: "tylermcginic",
//     avatar:
//       "https://res.cloudinary.com/uidotdev/image/twitter_name/tylermcginnis",
//   },
//   sarah_edo: {
//     name: "sarah_edo",
//     handle: "sarah_edo",
//     avatar: "https://res.cloudinary.com/uidotdev/image/twitter_name/sarah_edo",
//   },
// };

// type Users = typeof users;

// const getUsers = () => users;

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const List = <T,>({ items, renderItem }: ListProps<T>) => (
  <ul>{items.map(renderItem)}</ul>
);

// const Invoices = () => {
//   const invoicesIds = [1, 2, 3, 4];

//   return (
//     <>
//       <h1>Invoices</h1>
//       <List
//         items={invoicesIds}
//         renderItem={(invoiceId) => (
//           <Link to={`invoices/:${invoiceId}`}>{invoiceId}</Link>
//         )}
//       />
//     </>
//   );
// };

// export const Invoice = () => {
//   const { id } = useParams();

//   return <p>Invoice: {id}</p>;
// };

// const Students = () => {
//   const studentsNames = ["tyler", "jake", "Mikenzi"];

//   return (
//     <>
//       <h1>studentsNames</h1>
//       <List
//         items={studentsNames}
//         renderItem={(studentName) => (
//           <Link to={`students/:${studentName}`}>{studentName}</Link>
//         )}
//       />
//     </>
//   );
// };

// //  Query strings
// //  Customizing Routers Link component

// export const Users = () => {
//   const usersNames = ["tyler", "sarah_edo", "Alex"];

//   return (
//     <>
//       <h1>Users</h1>
//       <List
//         items={usersNames}
//         renderItem={(name) => (
//           <li key={name}>
//             <Link to={`/?user=${name}`}>{name}</Link>
//           </li>
//         )}
//       />
//       <User />
//     </>
//   );
// };

// const p = {
//   message: "user has not been found",
//   name: "UserNotFoundError",
// } as Error;

// const userErrorsNames = [
//   "UserUndefinedSelectError",
//   "UserNotFoundError",
// ] as const;
// type UserErrorsNames = typeof userErrorsNames[number];

// type UserError = { message: string; name: UserErrorsNames };

// const createUserError =
//   (message: string) =>
//   (userErrorName: UserErrorsNames): UserError => ({
//     message,
//     name: userErrorName,
//   });

// const userErrorsMessages: Record<UserErrorsNames, string> = {
//   UserNotFoundError: "User does not exist.",
//   UserUndefinedSelectError: "User does not yet select the user name",
// };

// type UserErrorsMessages = typeof userErrorsMessages;

// const getQueryValueByKey =
//   (prop: string) => (urlSearchParams: URLSearchParams) =>
//     O.fromNullable(urlSearchParams.get(key));

// const getUserByName = (userName: string) => (users: Users) =>
//   pipe(
//     users,
//     RREC.lookup(userName),
//     E.fromOption(() =>
//       createUserError(`${userName} does not exist.`)("UserNotFoundError")
//     )
//   );

// const getUserInfoByQuery =
//   (prop: string) => (users: Users) => (urlSearchParams: URLSearchParams) =>
//     pipe(
//       urlSearchParams,
//       getQueryValueByKey(key),
//       E.fromOption(
//         (): UserError =>
//           createUserError(`${key} is not defined in query params.`)(
//             "UserUndefinedSelectError"
//           )
//       ),
//       E.chain((userName) => getUserByName(userName)(users))
//     );

// const getUserInfo = getUserInfoByQuery("user");

// type UserInfoProps = typeof users["tyler"];

// const UserInfo = ({ avatar, handle, name }: UserInfoProps) => (
//   <div>
//     <h1>{name}</h1>
//     <img src={avatar} alt="avatar" />
//     <p>{handle}</p>
//   </div>
// );

// type UserInfoInferedProps = React.ElementProps<typeof UserInfo>;

// type UserErrorMessageProps = { error: UserError };

// const getUserErrorMessage =
//   (userErrorName: UserErrorsNames) =>
//   (userErrorsMessages: UserErrorsMessages) =>
//     pipe(userErrorsMessages, RREC.lookup(userErrorName));

// //  TODO
// //  getUsers
// // const userErrorMessageVariant: Record<UserErrorsNames, React.ReactNode> = {
// //   UserNotFoundError: <p> </p>,
// // };

// const UserErrorMessage = ({ error }: UserErrorMessageProps) => {
//   const userErrorMessage = pipe(
//     userErrorsMessages,
//     getUserErrorMessage(error.name),
//     O.fold(constNull, identity)
//   );

//   const errorName = error.name;

//   if (errorName === "UserNotFoundError") {
//     return <h2>{userErrorMessage}</h2>;
//   }

//   if (errorName === "UserUndefinedSelectError") {
//     return <p>{userErrorMessage}</p>;
//   }

//   return <p>No defined error {userErrorMessage}</p>;
// };

// type UserInfoVariantProps = { searchParams: URLSearchParams; users: Users };

// const UserInfoVariant = ({ searchParams, users }: UserInfoVariantProps) => {
//   const UserDisplay = pipe(
//     searchParams,
//     getUserInfo(users),
//     E.fold((error) => UserErrorMessage({ error }), UserInfo)
//   );
//   return UserDisplay;
// };

// export const User = () => {
//   const [searchParams] = useSearchParams();
//   const users = getUsers();
//   const rest = { users, searchParams };

//   return <UserInfoVariant {...rest} />;
// };

// export const Student = () => {
//   const { name } = useParams();

//   return <p>Student: {name}</p>;
// };

type MenuLinkProps = LinkProps & { mark?: string };
const MenuLink = ({ to, children, mark, ...props }: MenuLinkProps) => {
  const locationWithoutSlash = removeFirstLetter(useLocation().pathname);
  const isCurrentLocation = locationWithoutSlash === to;
  const linMark = isCurrentLocation ? mark : "";

  return (
    <div className={isCurrentLocation ? "active" : ""}>
      {linMark}
      <Link to={to} {...props}>
        {children}
      </Link>
    </div>
  );
};

// export const Settings = () => <h2>Settings</h2>;
// export const Notifications = () => <h2>Notifications</h2>;

const removeFirstLetter = (string: string) =>
  [...string].filter((_, index) => index !== 0).join("");

const upperCaseFirstLetter2 = (string: string) =>
  [...string]
    .map((char: string, index) => (!index ? char.toUpperCase() : char))
    .join("");

const upperCaseFirstLetter = (string: string) =>
  pipe([...string], ([firstChar, ...restChars]) =>
    [firstChar.toUpperCase(), ...restChars].join("")
  );

interface LinksProps {
  links: string[];
  state?: unknown;
}
//  TODO
//  extract chars after / - delimiter in url, newsletters/react/{new-syntax}
const Links = ({ links, ...props }: LinksProps) => {
  const LinksMarks: Record<string, string> = {
    home: "🏠",
    newsletters: "🔔",
    dashboard: "🏭",
  };

  return (
    <List
      items={links}
      renderItem={(menuItem) => (
        <li key={menuItem}>
          <MenuLink
            to={`${menuItem === "home" ? "/" : menuItem}`}
            mark={LinksMarks[menuItem]}
            {...props}
          >
            {upperCaseFirstLetter(menuItem)}
          </MenuLink>
        </li>
      )}
    />
  );
};

// const QuoteMenu = () => {
//   const Links = ["home", "people"];

//   return (
//     <List
//       items={Links}
//       renderItem={(menuItem) => (
//         <li key={menuItem}>
//           <MenuLink to={`${menuItem}`}>
//             {upperCaseFirstLetter(menuItem)}
//           </MenuLink>
//         </li>
//       )}
//     />
//   );
// };

// const getPeople = (): PersonWithBio[] =>
//   people.map(({ id, bio, name }) => ({ id, bio, name }));

// const getArtist = (PersonId: string) =>
//   people.filter(({ id }) => id === PersonId);
// const getQuotes = flow(
//   getArtist,
//   A.chain(({ quotes }) => quotes)
// );

// type QuoteProps = Quote;
// const Quote = ({ id, text }: Quote) => <h5>{text}</h5>;

// export const QuotesContainer = () => {
//   const { id } = useParams();

//   const quotes = id ? getQuotes(id) : undefined;

//   if (!quotes) return null;

//   console.log("QuotesContainer id", id);

//   return (
//     <List
//       items={quotes}
//       renderItem={(quote) => (
//         <li key={quote.text}>
//           <Quote {...quote} />
//         </li>
//       )}
//     />
//   );
// };

// type PersonProps = PersonWithBio;
// export const PersonContainer = () => {
//   const people = getPeople();

//   return (
//     <>
//       <List
//         items={people}
//         renderItem={({ id, name, bio }) => (
//           <li key={id}>
//             <Link to={id}>{name}</Link>
//             <p>{bio}</p>
//           </li>
//         )}
//       />
//       <Routes>
//         <Route path={":id"} element={<QuotesContainer />} />
//       </Routes>
//     </>
//   );
// };
// export const PersonContainerOutlet = () => {
//   const people = getPeople();

//   return (
//     <>
//       <List
//         items={people}
//         renderItem={({ id, name, bio }) => (
//           <li key={id}>
//             <Link to={id}>{name}</Link>
//             <p>{bio}</p>
//           </li>
//         )}
//       />
//       <Outlet />
//     </>
//   );
// };

// export const PeopleList = () => {
//   // const people = getPeople();

//   return (
//     <>
//       <PersonContainer />
//       <Routes>
//         <Route path={`:id/*`} element={<PersonContainer />} />
//       </Routes>
//     </>
//   );
// };

//  TODO
//  to useForm with io-ts validations
//  do imperative variant - handleInputChange
const PersonContext = React.createContext<PersonWithAgeFormState>({
  name: "",
  favoritePerson: "",
  age: 0,
});

//  Create context with no upfront default value
const createCtx = <T extends unknown | null>() => {
  const context = React.createContext<T | undefined>(undefined);

  const useCtx = () => {
    const ctx = useContext(context);

    //  handle default value which can be undefined
    if (typeof ctx === "undefined") {
      throw new Error("useCtx must be inside in Provider with a value");
    }
    return ctx;
  };
  return [useCtx, context.Provider] as const;
};

const [useCtx, SettingProvider] = createCtx<string>();

const Component = () => {
  const val = useCtx();

  return <p>{val}</p>;
};

const AppTest = () => {
  const key = "id";

  return (
    <SettingProvider value={key}>
      <Component />
    </SettingProvider>
  );
};
type Person = { fullName: string; age: number; isAdult: boolean };
type PersonProviderValueProps = {
  person: Person;
  updatePerson: UpdatePerson;
};

type UpdatePersonByProp = <Prop extends keyof Person>(
  prop: Prop
) => <Value extends Person[Prop]>(value: Value) => void;

type UpdatePerson = <Prop extends keyof Person>(
  prop: Prop
) => (value: unknown) => void;

const [useContex, Provider] = createCtx<PersonProviderValueProps>();

type PersonProviderProps = {
  children: React.ReactNode[];
};

const isNumber = (u: unknown): u is number => typeof u === "number";
const isString = (u: unknown): u is string => typeof u === "string";
const isBoolean = (u: unknown): u is boolean => typeof u === "boolean";

const personValidators = {
  fullName: isString,
  age: isNumber,
  isAdult: isBoolean,
};

type PersonValidators = typeof personValidators;
type PersonValidatorsKeys = keyof typeof personValidators;

const isAgeProp = (prop: PersonValidatorsKeys): prop is "age" => prop === "age";
const isIsAdultProp = (prop: PersonValidatorsKeys): prop is "isAdult" =>
  prop === "isAdult";
const isFullNameProp = (prop: PersonValidatorsKeys): prop is "fullName" =>
  prop === "fullName";

const isAgeValue = isNumber;
const isIsAdultValue = isBoolean;
const isFullNameValue = isString;

const personValidatorsTuples = {
  age: [isAgeProp, isAgeValue],
  fullName: [isFullNameProp, isFullNameValue],
  isIsAdult: [isIsAdultProp, isIsAdultValue],
};

// const shouldPersonUpdate
type PersonUnknownField = { prop: keyof Person; value: unknown };

const createPersonUnknownField =
  <T extends keyof Person>(prop: T) =>
  (value: unknown) => ({ prop, value });

class PersonValidator {
  private validators: PersonValidators;

  constructor(personValidators: PersonValidators) {
    this.validators = personValidators;
  }

  private _getValidator<T extends keyof PersonValidators>(
    prop: T
  ): PersonValidators[T] {
    return this.validators[prop];
  }

  validateAge(value: unknown): value is number {
    return this._getValidator("age")(value);
  }

  validateFullName(value: unknown): value is string {
    return this._getValidator("fullName")(value);
  }

  validateIsAdult(value: unknown): value is boolean {
    return this._getValidator("isAdult")(value);
  }
}

//  Context Module Function pattern
const PersonProvider = (PersonProviderProps: PersonProviderProps) => {
  const { children } = PersonProviderProps;
  const [person, setPerson] = useState<Person>({} as Person);

  const updatePersonByProp: UpdatePersonByProp =
    <Prop extends keyof Person>(prop: Prop) =>
    <Value extends Person[Prop]>(value: Value) =>
      setPerson((prevState) => ({ ...prevState, [prop]: value }));

  const updatePerson: UpdatePerson = (prop) => (value) => {
    const personUnknownField = createPersonUnknownField(prop)(value);
    const personValidator = new PersonValidator(personValidators);

    //  v1
    // if(isAgeProp(prop)){
    //   const validator = personValidators[prop];
    //   return  validator(value) ? updatePersonByProp(prop)(value): undefined;
    // } else if (isIsAdultProp(prop)){
    //   const validator = personValidators[prop];
    //   return  validator(value) ? updatePersonByProp(prop)(value): undefined;
    // } else if (isFullNameProp(prop)){
    //   const validator = personValidators[prop];
    //   return  validator(value) ? updatePersonByProp(prop)(value): undefined;
    // }

    // //  v2
    // if(isAgeProp(prop) && personValidators[prop](value)){
    //   return  updatePersonByProp(prop)(value);
    // } else if (isIsAdultProp(prop) && personValidators[prop](value)){
    //   return  updatePersonByProp(prop)(value);
    // } else if (isFullNameProp(prop) && personValidators[prop](value)){
    //   return  updatePersonByProp(prop)(value);
    // }

    //  v3
    if (isAgeProp(prop) && isAgeValue(value)) {
      return updatePersonByProp(prop)(value);
    } else if (isIsAdultProp(prop) && isIsAdultValue(value)) {
      return updatePersonByProp(prop)(value);
    } else if (isFullNameProp(prop) && isFullNameValue(value)) {
      return updatePersonByProp(prop)(value);
    }

    //  v4
    //  TODO
    //  validate structure = PersonField = PersonUnknownField | PersonField
    //

    // if(personValidator.validateAge(value)){
    //   return  updatePersonByProp(prop)(value);
    // } else if (isIsAdultProp(prop) && isIsAdultValue(value)){
    //   return  updatePersonByProp(prop)(value);
    // } else if (isFullNameProp(prop) && isFullNameValue(value)){
    //   return  updatePersonByProp(prop)(value);
    // }
  };

  return <Provider value={{ person, updatePerson }}>{children}</Provider>;
};

const validateAgeProp =
  (prop: keyof Person) =>
  (value: unknown): value is number => {
    return isAgeProp(prop) && personValidators[prop](value);
  };

const validateProp = ({ prop, value }: PersonUnknownField) => {
  return prop === "age" && isAgeValue(value);
};

const usePersonForm = () => {
  const PersonContext = useContex();
  return PersonContext;
};

const PersonMenu = () => {
  const Links = ["person", "favouritePerson"];

  return (
    <List
      items={Links}
      renderItem={(menuItem) => (
        <li key={menuItem}>
          <MenuLink to={`${menuItem}`}>
            {upperCaseFirstLetter(menuItem)}
          </MenuLink>
        </li>
      )}
    />
  );
};

type PersonFormProps = {
  onFormSubmit: (
    foofFormState: PersonFormState
  ) => (e: React.FormEvent<HTMLFormElement>) => void;
};
type PersonFormState = { name: string; favoritePerson: string };
type PersonWithAgeFormState = {
  name: string;
  favoritePerson: string;
  age: number;
};
type FormStatePropChange = keyof PersonFormState;

// const PersonForm = ({ onFormSubmit }: PersonFormProps) => {
//   const [formState, setFormState] = useState<PersonFormState>({
//     favoritePerson: "",
//     name: "",
//   });

//   const handleInputChange =
//     (prop: FormStatePropChange) => (e: React.ChangeEvent<HTMLInputElement>) =>
//       setFormState((prevState) => ({ ...prevState, [prop]: e.target.value }));

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onFormSubmit(formState)(e);
//       }}
//     >
//       <label htmlFor="name">
//         Name:
//         <input
//           type="text"
//           id="name"
//           value={formState.name}
//           onChange={handleInputChange("name")}
//         />
//       </label>
//       <br />
//       <label htmlFor="Person">
//         Favourite Person:
//         <input
//           type="text"
//           id="Person"
//           value={formState.favoritePerson}
//           onChange={handleInputChange("favoritePerson")}
//         />
//       </label>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };
// const Links = ["Person", "favouritePerson"];
// export const PersonContainer = () => {
//   const navigate = useNavigate();

//   const [PersonForm, setPersonForm] = useState<PersonFormState>({
//     favoritePerson: "",
//     name: "",
//   });

//   const handleFormSubmit =
//     (formState: PersonFormState) => (e: React.FormEvent<HTMLFormElement>) => {
//       console.log(e);
//       setPersonForm(formState);
//       navigate("/Person/favouritePerson");
//     };

//   return (
//     <>
//       <PersonForm onFormSubmit={handleFormSubmit} />
//       <Routes>
//         <Route path=":favouritePerson" element={<PersonInfo {...PersonForm} />} />
//       </Routes>
//     </>
//   );
// };

// const PersonForm = ({ onFormSubmit }: PersonFormProps) => {
//   const { Person, updatePersonByProp } = usePersonForm();

//   const handleInputChange =
//     (prop: FormStatePropChange) => (e: React.ChangeEvent<HTMLInputElement>) => ;

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onFormSubmit(formState)(e);
//       }}
//     >
//       <label htmlFor="name">
//         Name:
//         <input
//           type="text"
//           id="name"
//           value={Person.name}
//           onChange={handleInputChange("name")}
//         />
//       </label>
//       <br />
//       <label htmlFor="Person">
//         Favourite Person:
//         <input
//           type="text"
//           id="Person"
//           value={Person.favoritePerson}
//           onChange={handleInputChange("favoritePerson")}
//         />
//       </label>
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// const PersonContainer = () => {
//   const { Person } = usePersonForm();

//   const handleFormSubmit =
//     (formState: PersonFormState) => (e: React.FormEvent<HTMLFormElement>) => {
//       console.log(e);
//       setPersonForm(formState);
//       navigate("/Person/favouritePerson");
//     };

//   return (
//     <>
//       <PersonForm onFormSubmit={handleFormSubmit} />
//       <PersonInfo {...PersonForm} />
//     </>
//   );
// };

// export const PersonPageForm = () => {
//   const navigate = useNavigate();

//   const [PersonForm, setPersonForm] = useState<PersonFormState>({
//     favoritePerson: "",
//     name: "",
//   });

//   const handleFormSubmit =
//     (formState: PersonFormState) => (e: React.FormEvent<HTMLFormElement>) => {
//       console.log(e);
//       setPersonForm(formState);
//       navigate("/Person/favouritePerson");
//     };

//   return (
//     <>
//       <PersonProvider>
//         <PersonForm onFormSubmit={handleFormSubmit} />
//         <PersonInfo {...PersonForm} />
//       </PersonProvider>
//     </>
//   );
// };

// const PersonInfoPage = () => {
//   const { Person } = usePersonForm();

//   if (
//     Person.age !== undefined &&
//     Person.favoritePerson !== undefined &&
//     Person.age !== undefined
//   )
//     return null;

//   return <PersonInfo {...Person} />;
// };

// type PersonInfoProps = PersonFormState;
// const PersonInfo = ({ favoritePerson, name }: PersonInfoProps) => (
//   <>
//     <h2>favouritePerson : {favoritePerson}</h2>
//     <h3>name: {name}</h3>
//   </>
// );

const friends = [
  {
    name: "Tyler McGinnis",
    handle: "tylermcginnis",
    avatar:
      "https://res.cloudinary.com/uidotdev/image/twitter_name/tylermcginnis",
  },
  {
    name: "Sarah Drasner",
    handle: "sarah_edo",
    avatar: "https://res.cloudinary.com/uidotdev/image/twitter_name/sarah_edo",
  },
  {
    name: "Alex Anderson",
    handle: "ralex1993",
    avatar: "https://res.cloudinary.com/uidotdev/image/twitter_name/ralex1993",
  },
];
type Friend = typeof friends[number];

const isFriend = (u: unknown): u is Friend =>
  u !== null &&
  typeof (u as Friend).avatar === "string" &&
  typeof (u as Friend).handle === "string" &&
  typeof (u as Friend).name === "string";

const isArrayOfFriends = (u: unknown): u is Friend[] =>
  Array.isArray(u) && u.every(isFriend);

const isObject = (u: unknown): u is Record<string, unknown> =>
  typeof u === "object";

type FriendsRecord = { friends: Friend[] };

const isFriendRecord = (u: unknown): u is FriendsRecord =>
  isObject(u) &&
  typeof u.friends !== "undefined" &&
  isArrayOfFriends(u.friends);

// const NavBar = () => {
//   const [friendsArr] = useState(friends);
//   const friendsState = { friends: friendsArr };

//   return (
//     <>
//       {/* <Invoices />
//     <Students /> */}
//       {/* <Users /> */}
//       {/* <Links /> */}
//       <Links links={["home", "friends"]} state={friendsState} />
//     </>
//   );
// };

const USER_MENU = [{ route: "home" }, { route: "user" }, { route: "settings" }];

interface NavBarProps {
  items: typeof USER_MENU;
}
const NavBar = ({ items }: NavBarProps) => {
  return (
    <ul className="nav">
      {items.map(({ route }) => (
        <li key={route}>
          <Link to={route.toLocaleLowerCase() === "home" ? "/" : route}>
            {upperCaseFirstLetter(route)}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Home = () => <h2>Home</h2>;
export const Profile = () => <h2>Profile</h2>;
export const Settings = () => <h2>Settings</h2>;

type FriendProps = typeof friends[number];
const Friend = ({ avatar, handle, name }: FriendProps) => (
  <div>
    <img src={avatar} alt="avatar" />
    <Link to={`https://twitter.com/${handle}`}>{name}</Link>
  </div>
);

interface FriendsListProps {
  items: typeof friends;
}
const FriendsList = (props: FriendsListProps) => (
  <List {...props} renderItem={Friend} />
);

export const Friends = () => {
  const { state } = useLocation();

  console.log("Friends");
  if (!isFriendRecord(state)) return null;

  return <FriendsList items={state.friends} />;
};
export const Dashboard = () => <h2>Dashboard</h2>;
export const Newsletters = () => {
  const newsLettersNames = ["home", "friends"];

  return (
    <>
      <h2>Newsletters</h2>
      <List
        items={newsLettersNames}
        renderItem={(menuItem) => (
          <li key={menuItem}>
            <MenuLink to={`${menuItem}`}>
              {upperCaseFirstLetter(menuItem)}
            </MenuLink>
          </li>
        )}
      />
      <Outlet />
    </>
  );
};

interface NewsletterProps {
  publication: string;
}
const Newsletter = ({ publication }: NewsletterProps) => (
  <p>publication: {publication}</p>
);

const NewsletterList = () => {
  console.log("NewsletterList");

  const params = useParams();
  const { topicId: publication } = params;

  console.log("publication", publication);

  if (!publication) return null;

  return <Newsletter publication={publication} />;
};

const User = () => <h2>Rainbows</h2>;

type Route = {
  path: string;
  main: () => JSX.Element;
  sidebar: () => JSX.Element;
};

const routesConfig: Route[] = [
  {
    path: "/",
    main: () => <Home />,
    sidebar: () => <p>This is a home page.</p>,
  },
  {
    path: "user",
    main: () => <User />,
    sidebar: () => <p>This is a user info page.</p>,
  },
  {
    path: "settings",
    main: () => <Settings />,
    sidebar: () => <p>This is a setting page of account.</p>,
  },
];

interface RoutesListProps {
  routes: Route[];
  renderRoute: (route: Route, index: number) => JSX.Element;
}

const RoutesList = ({ routes, renderRoute }: RoutesListProps) => (
  <Routes>{routes.map((route, index) => renderRoute(route, index))}</Routes>
);

interface SideBarProps {
  routes: Route[];
}

const SideBar = ({ routes }: SideBarProps) => {
  return (
    <>
      <NavBar items={USER_MENU} />
      <RoutesList
        routes={routes}
        renderRoute={({ sidebar, path }, index) => (
          <Route path={path} element={sidebar()} key={`${index}`} />
        )}
      />
    </>
  );
};
interface MainProps {
  routes: Route[];
}

const Main = ({ routes }: MainProps) => {
  return (
    <>
      <RoutesList
        routes={routes}
        renderRoute={({ main, path }, index) => (
          <Route path={path} element={main()} key={`${index}`} />
        )}
      />
    </>
  );
};

export function App() {
  const [routes] = useState(routesConfig);

  //  TODO
  //  Carousel - change structure of next,prev function
  //  Dice - add odd and even function and Reader monad
  //  Menu - add useClickOutside hook
  //  useTime - write this hook in functional way
  //  useFetch - use TE monad
  //  Currencies - do validation of input data

  return (
    <>
      <div className="wrapper">
        <SideBar routes={routes} />
        <Main routes={routes} />
      </div>
    </>
  );
}

// export const AppWithRoutes = () => {
//   const routes = useRoutes([
//     { path: "/", element: <Home /> },
//     {
//       path: "/newsletters",
//       element: <Newsletters />,
//       children: [{ path: ":topicId", element: <NewsletterList /> }],
//     },
//   ]);

//   return (
//     <>
//       <NavBar />
//       {routes}
//     </>
//   );
// };
