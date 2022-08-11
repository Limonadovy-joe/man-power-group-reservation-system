import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  Outlet,
  useNavigate,
  Params,
  useSearchParams,
  NavLinkProps,
  URLSearchParamsInit,
} from "react-router-dom";
import classNames from "classnames";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as EQ from "fp-ts/Eq";
import * as IO from "fp-ts/IO";
import * as IOE from "fp-ts/IOEither";
import * as RA from "fp-ts/ReadonlyArray";
import * as SE from "fp-ts/Semigroup";
import * as B from "fp-ts/boolean";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as RR from "fp-ts/ReadonlyRecord";
import * as NEA from "fp-ts/NonEmptyArray";
import * as A from "fp-ts/Array";

import {
  pipe,
  flow,
  constVoid,
  identity,
  Lazy,
  getSemigroup,
  absurd,
} from "fp-ts/function";
import { Predicate } from "fp-ts/Predicate";
import {
  useStableEffect,
  useStableCallback,
  useStable,
} from "fp-ts-react-stable-hooks";
import { useToggle } from "../../hooks/useToggle";

import BulbOn from "../../assets/images/on.svg";
import BulbOff from "../../assets/images/off.svg";
import { log } from "fp-ts/lib/Console";
import { boolean, string } from "fp-ts";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router";
// import { useFilter } from "../../hooks/useFilter";
import { getValuefromIO } from "../../utils/";
import { useStableState } from "../../hooks/useStableState";

// // const logger = flow(
// //   OptionFromPredicate((value: string) => value.length > 0),
// //   OptionFold(() => log("User is not writting a text in this moment."), log)
// // );

// // const logger2 = flow(
// //   OptionFromPredicate((value: string) => value.length > 0),
// //   OptionGetOrElseW(() => "User is not writting a text in this moment."),
// //   log
// // );

// // // const handleLog = flow(IOOf, IOChain(logger2));
// // const handleLog = (str: string) => pipe(str, IOOf, IOChain(logger2));

// // // const confirmIO = flow(confirm, IOOf);
// // const confirmIO =
// //   (arg: string | undefined): IO<boolean> =>
// //   () =>
// //     confirm(arg);
// // // const formConfirmLeave = confirmIO(
// // //   "When you leave the page, You will lose filled data in the form."
// // // );

// // // const handlePageLeave = flow(IOChain(()));

// // const handlePageLeave = ({
// //   preventDefault,
// //   message,
// // }: {
// //   preventDefault: IO<void>;
// //   message: string;
// // }) =>
// //   pipe(
// //     message,
// //     confirmIO,
// //     IOChain((hasToLeave) => (!hasToLeave ? preventDefault : IOOf(undefined)))
// //   );

// // const Input = () => {
// //   // const [value, setValue] =

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
// //     pipe(e.target.value, handleLog)();

// //   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
// //     return pipe(
// //       {
// //         preventDefault: () => e.preventDefault(),
// //         message:
// //           "When you leave the page, You will lose filled data in the form.",
// //       },
// //       handlePageLeave
// //     )();
// //   };

// //   return (
// //     <>
// //       <a href="https://www.seznam.cz" onClick={handleLinkClick}>
// //         News
// //       </a>
// //       <div>
// //         <label htmlFor="name">Name: </label>
// //         <input type="text" id="name" onChange={handleInputChange} />
// //       </div>
// //     </>
// //   );
// // };

// // type ContainerProps = {
// //   bool: boolean;
// // };

// // const Container = ({ bool }: ContainerProps) => {
// //   const { value, setValue } = useToggle(bool);

// //   useEffect(() => {
// //     console.log("Container - useEffect - re-render - bool", bool);
// //   });

// //   useEffect(() => {
// //     console.log("Container - useEffect  - bool", bool);
// //   }, [bool]);

// //   return (
// //     <div>
// //       <p>Value of toggle hook {`${value}`}</p>{" "}
// //     </div>
// //   );
// // };

// type BulbOn = "on";
// type BulbOff = "off";
// type BulbState = BulbOn | BulbOff;

// type BulbProps = {
//   state: O.Option<BulbState>;
// };

// const bulbStateEq: EQ.Eq<BulbState> = {
//   equals: (s1, s2) => s1 === s2,
// };

// const bulbOptionEq = O.getEq(bulbStateEq);

// // export const Bulb = ({ state }: BulbProps) => {
// //   console.log("bulbStateEq", bulbOptionEq.equals(O.some("on"), O.some("off")));

// //   const mapBulbStateToBool = useStableCallback(
// //     flow(
// //       O.map<BulbState, boolean>((bulbState) => bulbState === "on"),
// //       O.fold(() => false, identity)
// //     ),
// //     [state],
// //     EQ.Pair(bulbOptionEq)
// //   );

// //   const { value, setValue } = useToggle(mapBulbStateToBool(state));
// //   const bulbInfo = !value ? `Bulb is off` : `Bulb is on`;

// //   const handleButtonClick =
// //     (bulbState: BulbState) => (_: React.MouseEvent<HTMLButtonElement>) =>
// //       bulbState === "on" ? setValue(true)() : setValue(false)();

// //   return (
// //     <div className="bulb">
// //       <img
// //         className="bulb__image"
// //         src={!value ? BulbOff : BulbOn}
// //         width={80}
// //         height={80}
// //         alt={bulbInfo}
// //         title={bulbInfo}
// //       />
// //       <div className="bulb__info">{bulbInfo}</div>
// //       <div className="bulb__buttons">
// //         <button
// //           className="bulb__button"
// //           onClick={handleButtonClick("on")}
// //           disabled={value}
// //         >
// //           Set bulb on!
// //         </button>
// //         <button
// //           className="bulb__button"
// //           onClick={handleButtonClick("off")}
// //           disabled={!value}
// //         >
// //           Set bulb off!
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

// // type DiceProps = {
// //   number?: DiceNumber;
// //   dicesUrls: DicesUrls;
// // };

// // export type DicesUrls = ReadonlyArray<string>;

// // export const Dice = ({ dicesUrls, number = 1 }: DiceProps) => {
// //   const [diceNumber, setDiceNumber] = useState<DiceNumber>(number);
// //   const rollCount = useRef<number | null>(null);

// //   const calcDiceIndex =
// //     (diceNumber: DiceNumber) =>
// //     (dicesUrls: DicesUrls): Lazy<number> =>
// //     () =>
// //       (diceNumber - 1) % dicesUrls.length;

// //   const getDiceUrl =
// //     (diceIndex: number) =>
// //     (dicesUrls: DicesUrls): O.Option<string> =>
// //       RA.lookup(diceIndex, dicesUrls);

// //   const getDiceUrl2 =
// //     (dicesUrls: DicesUrls) =>
// //     (diceIndex: number): O.Option<string> =>
// //       RA.lookup(diceIndex, dicesUrls);

// //   const createDiceImg = (diceNumber: DiceNumber) => (dicesUrls: DicesUrls) =>
// //     pipe(
// //       dicesUrls,
// //       calcDiceIndex(diceNumber),
// //       IO.map(getDiceUrl2(dicesUrls)),
// //       IO.map(
// //         flow(
// //           O.map((src) => (
// //             <img
// //               className="dice__icon"
// //               src={src}
// //               key={src}
// //               width={80}
// //               height={80}
// //               alt={`dice ${diceNumber}`}
// //             />
// //           )),
// //           O.fold(
// //             () => (
// //               <p className="dice__src-error">
// //                 Dice number is incorect `${diceNumber}`
// //               </p>
// //             ),
// //             identity
// //           )
// //         )
// //       )
// //     );

// //   const diceImg = createDiceImg(diceNumber)(dicesUrls);

// //   const handleButtonIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
// //     setDiceNumber((value) =>
// //       value + 1 !== 7 ? ((value + 1) as DiceNumber) : (1 as DiceNumber)
// //     );
// //     rollCount.current = !rollCount.current ? 1 : rollCount.current + 1;
// //   };

// //   useEffect(() => {
// //     console.log(`Dice component - diceNumber changed ${diceNumber}`);
// //     // rollCount.current = rollCount.current ? rollCount.current + 1 : 0;
// //     console.log("rollCount", rollCount.current);
// //   }, [diceNumber]);

// //   useEffect(() => {
// //     console.log(`Dice component - number from props has changed ${number}`);
// //     setDiceNumber(number);
// //   }, [number]);

// //   useEffect(() => {
// //     console.log(`Dice component - diceUrls from props changed`, dicesUrls);
// //     setDiceNumber(number);
// //   }, [dicesUrls]);

// //   return (
// //     <div className="dice">
// //       {diceImg()}
// //       <p className="dice__number">Dice number {diceNumber}</p>
// //       <p className="dice__roll-count">
// //         Roll count {!rollCount.current ? 0 : rollCount.current}
// //       </p>
// //       <div className="dice__actions">
// //         <button
// //           className="dice__button dice__button--increment"
// //           onClick={handleButtonIncrement}
// //         >
// //           Roll next number
// //         </button>
// //         <button className="dice__button dice__button--even">
// //           Roll even number
// //         </button>
// //         <button className="dice__button dice__button--odd">
// //           Roll odd number
// //         </button>
// //         <button className="dice__button dice__button--reset">Reset</button>
// //       </div>
// //     </div>
// //   );
// // };

// // type CarouselProps =
// //   | { imageDefaultIndex?: number; imagesUrls: string[] }
// //   | {
// //       imageDefaultSrc?: string;
// //       imagesUrls: string[];
// //     };

// // type CarouselAction = "prev" | "next";

// // type CarouselConfig = {
// //   indexMin: number;
// //   indexMax: number;
// //   indexCurrent: number;
// // };

// // type CarouselConfigUpdate = (carouselConfig: CarouselConfig) => CarouselConfig;

// // // predicates
// // const isIndexMinimum: Predicate<CarouselConfig> = ({
// //   indexCurrent,
// //   indexMin,
// // }: CarouselConfig) => indexCurrent === indexMin;

// // const isIndexMaximum: Predicate<CarouselConfig> = ({
// //   indexCurrent,
// //   indexMax,
// // }: CarouselConfig) => indexCurrent === indexMax;

// // const equalsIndexBoundary = getSemigroup(B.SemigroupAny)<CarouselConfig>()
// //   .concat;

// // export const Carousel = ({ imagesUrls }: CarouselProps) => {
// //   const [carouselConfig, setCarouselConfig] = useState<CarouselConfig>(() => ({
// //     indexCurrent: 0,
// //     indexMin: 0,
// //     indexMax: imagesUrls.length - 1,
// //   }));

// // TODO
// // use useReducer

// // //TODO
// // const getActionValue = (carouselAction: CarouselAction) =>
// //   carouselAction === "next" ? 1 : -1;

// // const updateCarouselConfigByAction =
// //   (carouselAction: CarouselAction) =>
// //   (carouselConfig: CarouselConfig): CarouselConfig =>
// //     carouselAction === "next"
// //       ? { ...carouselConfig, indexCurrent: carouselConfig.indexCurrent + 1 }
// //       : { ...carouselConfig, indexCurrent: carouselConfig.indexCurrent - 1 };

// // const updateCarouselConfigCurrentIndex =
// //   (constant: number) =>
// //   (carouselConfig: CarouselConfig): CarouselConfig => ({
// //     ...carouselConfig,
// //     indexCurrent: carouselConfig.indexCurrent + constant,
// //   });

// // //TODO
// // const updateCarouselConfig2 =
// //   (carouselAction: CarouselAction) => (carouselConfig: CarouselConfig) =>
// //     pipe(carouselAction, getActionValue);

// // const updateCarouselConfig =
// //   (carouselAction: CarouselAction) => (carouselConfig: CarouselConfig) =>
// //     pipe(
// //       carouselAction,
// //       updateCarouselConfigByAction
// //       // equalsIndexBoundary(isIndexMaximum, isIndexMinimum),
// //       // (isIndexBoundary): CarouselConfig =>
// //       //   isIndexBoundary
// //       //     ? { ...carouselConfig }
// //       //     : {
// //       //         ...carouselConfig,
// //       //         indexCurrent:
// //       //           carouselAction === "next"
// //       //             ? carouselConfig.indexCurrent + 1
// //       //             : carouselConfig.indexCurrent - 1,
// //       //       }
// //     );

// //   const handleActionPrev: CarouselConfigUpdate = ({
// //     indexCurrent,
// //     ...props
// //   }: CarouselConfig) =>
// //     flow(isIndexMinimum, (isIndexMinimum) =>
// //       !isIndexMinimum
// //         ? { ...props, indexCurrent: indexCurrent - 1 }
// //         : { indexCurrent, ...props }
// //     )(carouselConfig);

// //   const handleActionNext: CarouselConfigUpdate = ({
// //     indexCurrent,
// //     ...props
// //   }: CarouselConfig) =>
// //     flow(isIndexMaximum, (isIndexMaximum) =>
// //       !isIndexMaximum
// //         ? { ...props, indexCurrent: indexCurrent + 1 }
// //         : { indexCurrent, ...props }
// //     )(carouselConfig);

// //   const handleCarouselAction =
// //     (onPrev: CarouselConfigUpdate, onNext: CarouselConfigUpdate) =>
// //     (carouselAction: CarouselAction) =>
// //     (carouselConfig: CarouselConfig) => {
// //       switch (carouselAction) {
// //         case "next":
// //           return pipe(onNext(carouselConfig), setCarouselConfig);
// //         case "prev":
// //           return pipe(onPrev(carouselConfig), setCarouselConfig);
// //         default:
// //           absurd(carouselAction);
// //       }
// //     };

// //   const handleButtonClick =
// //     (carouselAction: CarouselAction) =>
// //     (_: React.MouseEvent<HTMLButtonElement>) =>
// //       handleCarouselAction(handleActionPrev, handleActionNext)(carouselAction)(
// //         carouselConfig
// //       );

// //   const setButtonStateDisabled =
// //     (predicate: Predicate<CarouselConfig>) =>
// //     (carouselConfig: CarouselConfig) =>
// //       predicate(carouselConfig);

// //   useEffect(() => {
// //     console.log("Carousel - config", carouselConfig);
// //   }, [carouselConfig]);

// //   return (
// //     <div className="carousel">
// //       <button
// //         className="carousel__action"
// //         onClick={handleButtonClick("prev")}
// //         // disabled={setButtonStateDisabled(isIndexMinimum)(carouselConfig)}
// //       >
// //         Previous
// //       </button>
// //       <div className="carousel__media">
// //         <img
// //           className="carousel__image"
// //           src={imagesUrls[carouselConfig.indexCurrent]}
// //           alt="image"
// //           width={200}
// //           height={200}
// //         />
// //       </div>
// //       <p>Current index: {carouselConfig.indexCurrent}</p>
// //       <button
// //         className="carousel__action"
// //         onClick={handleButtonClick("next")}
// //         // disabled={setButtonStateDisabled(isIndexMaximum)(carouselConfig)}
// //       >
// //         Next
// //       </button>
// //     </div>
// //   );
// // };

// // type MenuProps = {
// //   isOpen?: boolean;
// // };

// // export const Menu = ({ isOpen = false }: MenuProps) => {
// //   const [isOpenMenu, setIsOpenMenu] = useState(isOpen);

// //   const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) =>
// //     setIsOpenMenu((val) => !val);

// //   const buttonClassName = classNames({
// //     hamburger: true,
// //     "hamburger--open": isOpenMenu,
// //   });

// //   return (
// //     <>
// //       <button
// //         className={buttonClassName}
// //         onClick={handleButtonClick}
// //         aria-label="menu"
// //       >
// //         <span></span>
// //         <span></span>
// //         <span></span>
// //       </button>
// //       {!isOpenMenu ? null : (
// //         <ul>
// //           <li>
// //             <a href="#about">About</a>
// //           </li>
// //           <li>
// //             <a href="#work">Work</a>
// //           </li>
// //           <li>
// //             <a href="#contacts">Contacts</a>
// //           </li>
// //           <li>
// //             <a href="#price-list">Price-list</a>
// //           </li>
// //         </ul>
// //       )}
// //     </>
// //   );
// // };

// // type TaskProps = {
// //   name: string;
// // };
// // export const Task = ({ name }: TaskProps) => {
// //   const [taskState, setTaskState] = useState(false);

// //   const handleButtonClick = (_: React.MouseEvent<HTMLButtonElement>) =>
// //     setTaskState((val) => !val);

// //   return (
// //     <li>
// //       <span>{name}</span>
// //       {!taskState ? (
// //         <button onClick={handleButtonClick}>Do a task</button>
// //       ) : null}
// //     </li>
// //   );
// // };

// // type TasksProps = {
// //   tasks: string[];
// //   render: (task: string) => React.ReactNode;
// // };
// // export const Tasks = ({ tasks, render }: TasksProps) => (
// //   <ul>{tasks.map(render)}</ul>
// // );

// // type ProgressProps = {
// //   color: string;
// // };

// // export const Progress = ({ color }: ProgressProps) => {
// //   const [progressVal, setProgressVal] = useState(0);

// //   const progressBarStyle: React.CSSProperties = {
// //     backgroundColor: color,
// //     width: `${progressVal}%`,
// //     height: "20px",
// //     border: `1px solid red`,
// //   };

// //   const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) =>
// //     setProgressVal((val) => (val !== 100 ? val + 10 : val));

// //   return (
// //     <div className="progress">
// //       <div className="progress__border">
// //         <div className="progress__bar" style={progressBarStyle}></div>
// //       </div>
// //       <button onClick={handleButtonClick}>Next 10%</button>
// //     </div>
// //   );
// // };

// // type Words = "maybe" | "yes" | "no";

// // type Vocabularies = ["maybe", "yes", "no"];
// // const vocals: Vocabularies = ["maybe", "yes", "no"];
// // export const Vocabulary = () => {
// //   const [counter, setCounter] = useState(0);

// //   const calcVocabularyIndex = (counter: number) => (vocals: string[]) =>
// //     counter % vocals.length;

// //   const changeVerdict = () => setCounter((counter) => counter + 1);

// //   const index = calcVocabularyIndex(counter)(vocals);

// //   return (
// //     <>
// //       <h3>Is raining in Prague? {vocals[index]}</h3>
// //       <button onClick={changeVerdict}>Change verdict</button>
// //     </>
// //   );
// // };

// // type CaseMoneyProps = {
// //   moneyDefault: number;
// // };

// // type CaseMoneyAction = "with" | "depo";

// // export const CaseMoney = ({ moneyDefault }: CaseMoneyProps) => {
// //   const [money, setMoney] = useState(moneyDefault);

// //   const handleButtonClick =
// //     (action: CaseMoneyAction) => (e: React.MouseEvent<HTMLButtonElement>) =>
// //       setMoney((value) => (action === "depo" ? value + 5 : 0));

// //   return (
// //     <div
// //       style={{
// //         border: "1px solid red",
// //         width: "250px",
// //         height: "100px",
// //         marginTop: "10px",
// //         padding: "10px",
// //       }}
// //     >
// //       CaseMoney
// //       <p>Money: {money}</p>
// //       <button onClick={handleButtonClick("depo")}>Deposit 5 dollars</button>
// //       <button onClick={handleButtonClick("with")}>Withdraw</button>
// //     </div>
// //   );
// // };

// export const fetchData = <A, E extends Error = Error>(apiEndpoint: string) =>
//   TE.tryCatch<E, A>(
//     () => fetch(apiEndpoint).then((response) => response.json()),
//     (e) => new Error(String(e)) as E
//   );

// type RateProps = {
//   from: string;
//   to: string;
//   rate: number;
// };

// export const Rate = ({ from, to, rate }: RateProps) => {
//   return (
//     <div className="rate">
//       <div className="rate__from">{from}</div>
//       <div className="rate__value">
//         Rate: {rate} {to}
//       </div>
//     </div>
//   );
// };

// type Currencies = "USD" | "EUR" | "GBP";
type CurrenciesRecord = typeof currenciesRecord;
const currenciesRecord = { USD: "USD", EUR: "EUR", GBP: "GBP" } as const;
type Currencies = typeof currenciesRecord[keyof typeof currenciesRecord];
// const isCurrency =
//   (currenciesRecord: CurrenciesRecord) =>
//   (str: string): str is Currencies =>
//     pipe(
//       currenciesRecord,
//       RR.lookup(str),
//       O.fold(
//         () => false,
//         (_) => true
//       )
//     );
const isCurrency = (str: string): str is Currencies =>
  str === "USD" || str === "EUR" || str === "GBP";
type CurrencySelect = "from" | "to";
type CurrencySetterTo<T extends Currencies> = {
  setter: UseStateSetter<T>;
  type: CurrencySelect;
};
type CurrencySetterFrom<T extends Currencies> = {
  setter: UseStateSetter<T>;
};
type CurrencySetters<T extends Currencies> =
  | CurrencySetterTo<T>
  | CurrencySetterFrom<T>;

// Helpers - these helpers should be used across the application
type Pair<V1, V2> = [V1, V2];
type Tuple<V1, V2, V3> = [V1, V2, V3];
type UseStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

//  Network infrastructure types
const QUERY_DELIMITER = ["&", ";"] as const;
type QUERY_DELIMITER = typeof QUERY_DELIMITER[number];

//  Validators
type EndpointValidator<P> = P extends `https://${infer P1}`
  ? `https://${P1}`
  : never;

type PathValidator<P> = P extends `/${infer P1}` ? `/${P1}` : never;

type KeyValueValidator<KV extends string> = KV extends `${infer K1}=${infer V1}`
  ? `${K1}=${V1}`
  : never;

// type KeyValueValidatorTest<KV extends string> = KV extends `${K}=${V}` ? ;

//  TODO
// Accept array of queries
type QueryValidator<Q> = Q extends `?${infer Q1}=${infer Q2}`
  ? `?${Q1}=${Q2}`
  : never;

// type EndpointWithQuriesValidator<
//   E,
//   P,
//   Q,
//   EV extends EndpointValidator<E> = EndpointValidator<E>,
//   PV extends PathValidator<P> = PathValidator<P>,
//   QV extends QueryValidator<Q> = QueryValidator<Q>
// > = `${EV}${PV}${QV}`;

//  Constructors
type KeyValueCreator<K extends string, V extends string> = `${K}=${V}`;

// TODO
// Query should accept an array of queries
// type Query<
//   D extends QUERY_DELIMITER,
//   P1 extends string,
//   P2 extends string,
//   Q1 extends KeyValueValidator<P1> = KeyValueValidator<P1>,
//   Q2 extends KeyValueValidator<P2> = KeyValueValidator<P2>
// > = `?${Q1}${D}${Q2}`;

//  ALERT
//
type Query<D extends QUERY_DELIMITER, P1 extends string, P2 extends string> =
  | P1
  | P2 extends KeyValueValidator<P1 | P2>
  ? `?${P1}${D}${P2}`
  : never;

type S = Query<"&", "from=CZK", "to=CZK">;
type L = EndpointValidator<"https://api.frankfurter.app">;

type LS = EndpointWithQueriesCreator<
  "https://api.frankfurter.app",
  "/latest",
  S
>;

type EndpointWithQueriesCreator<
  E,
  P,
  Q,
  EV extends EndpointValidator<E> = EndpointValidator<E>,
  PV extends PathValidator<P> = PathValidator<P>,
  QV extends QueryValidator<Q> = QueryValidator<Q>
> = `${EV}${PV}${QV}`;

// //  Exchange rate types

// // const isCurrency = (
// //   str: string,
// //   array: ReadonlyArray<string>
// // ): str is Currencies => array.includes(str);

// const currencies = ["USD", "EUR", "GBP", "CZK"] as const;
// type Currencies = typeof currencies[number];
// type CurrencyFrom = Currencies;
// type CurrencyTo = Currencies;

// type CurrencySetter<T extends Currencies = Currencies> = {
//   setter: UseStateSetter<T>;
// };
// type CurrencySelect = "from" | "to";

// const EXCHANGE_RATE_ENDPOINT = "https://api.frankfurter.app";
// type EXCHANGE_RATE_ENDPOINT = typeof EXCHANGE_RATE_ENDPOINT;

// const EXCHANGE_RATE_ENDPOINT_PATH = "/latest";
// type EXCHANGE_RATE_ENDPOINT_PATH = typeof EXCHANGE_RATE_ENDPOINT_PATH;

// const EXCHANGE_RATE_ENDPOINT_QUERY_DELIMITER: QUERY_DELIMITER = "&";
// type EXCHANGE_RATE_ENDPOINT_QUERY_DELIMITER =
//   typeof EXCHANGE_RATE_ENDPOINT_QUERY_DELIMITER;

// type EXCHANGE_RATE_ENDPOINT_WITH_QUERIES = EndpointWithQueriesCreator<
//   EXCHANGE_RATE_ENDPOINT,
//   EXCHANGE_RATE_ENDPOINT_PATH,
//   Query<
//     QUERY_DELIMITER,
//     KeyValueCreator<"from", CurrencyFrom>,
//     KeyValueCreator<"to", CurrencyTo>
//   >
// >;

// const isCurrency = (str: string): str is Currencies =>
//   str === "USD" || str === "EUR" || str === "GBP" || str === "CZK";

// const isExchangeRateEndpointWithQueries = (
//   str: string
// ): str is EXCHANGE_RATE_ENDPOINT_WITH_QUERIES =>
//   Array.isArray(str.match(/https:\/\//));

// const createUrlKeyValue = <K extends string, V extends string>([key, val]: Pair<
//   K,
//   V
// >): KeyValueCreator<K, V> => `${key}=${val}`;

// //  helper
// const createTuple = <A,>(nea: NEA.NonEmptyArray<A>) =>
//   pipe(nea, ([p1, p2]) => [p1, p2] as const);

// // TODO
// // Return array of url of keys values this remove createTuple
// const createUrlKeysValues = <
//   A extends string,
//   B extends string,
//   C extends string
// >(
//   keys: NEA.NonEmptyArray<A>,
//   values: NEA.NonEmptyArray<B>
// ) =>
//   pipe(
//     NEA.zipWith(keys, values, (prefix, currency) =>
//       createUrlKeyValue([prefix, currency])
//     ),
//     createTuple
//   );

// //  TODO
// //  This function only accepts a tuple of attributes(key-value pair) of url address yet
// //  Handle error -> Type '`?${P1}${D}${P2}`' is not assignable to type 'Query<D, P1, P2>'
// //  Remove as const
// const createQuery =
//   <D extends QUERY_DELIMITER>(delimiter: D) =>
//   <P1 extends string, P2 extends string>([q1, q2]: readonly [P1, P2]): Query<
//     D,
//     P1,
//     P2
//   > =>
//     `?${q1}${delimiter}${q2}` as Query<D, P1, P2>;

// const ss: EXCHANGE_RATE_ENDPOINT_WITH_QUERIES =
//   "https://api.frankfurter.app/latest?from=CZK&to=EUR";

// const s = createQuery("&")(["from=USD", "to=CZK"]);

// //  TODO
// //  Handle error
// //  Handle query parameter misstype
// const appendToEndpoint =
//   <E extends string>(endpoint: E) =>
//   <P extends string, Q extends string>([path, query]: readonly [
//     P,
//     Q
//   ]): EndpointWithQueriesCreator<E, P, Q> =>
//     `${endpoint}${path}${query}` as EndpointWithQueriesCreator<E, P, Q>;

// const l = appendToEndpoint("https://api.frankfurter.app")([
//   "/latest",
//   "?from=USD&to=CZK",
// ]);

// //  TODO
// //  EndpointConfig refactor to Reader monad
// //  Use URIValidators
// type EndpointConfig<E extends string, K, P extends string, V> = {
//   endpoint: E extends EndpointValidator<E> ? E : never;
//   path: P extends PathValidator<P> ? P : never;
//   query: {
//     delimiter: QUERY_DELIMITER;
//     keys: NEA.NonEmptyArray<K>;
//     values: NEA.NonEmptyArray<V>;
//   };
// };

// const validatorTest = <E extends string, K, P extends string, V>({
//   endpoint,
//   path,
//   query: { keys, values },
// }: EndpointConfig<E, K, P, V>) => ({
//   endpoint,
//   path,
//   query: { keys, values },
// });

// const createEndpoint = <
//   E extends string,
//   K extends string,
//   P extends string,
//   V extends string
// >({
//   query: { keys, values, delimiter },
//   path,
//   endpoint,
// }: EndpointConfig<E, K, P, V>) =>
//   flow(
//     createUrlKeysValues,
//     createQuery(delimiter),
//     (query) => [path, query] as const,
//     appendToEndpoint(endpoint)
//   )(keys, values);

// //  Fetch
// const fetchCurrency = (
//   endpoint: EXCHANGE_RATE_ENDPOINT_WITH_QUERIES
// ): TE.TaskEither<
//   Error,
//   { amount: number; base: string; date: string; rates: { CZK: number } }
// > => fetchData(endpoint);

// const createOptions =
//   <T,>(cb: (val: T) => React.ReactNode) =>
//   (values: ReadonlyArray<T>): React.ReactNode[] =>
//     values.map(cb);

// // TODO
// // updateEndpointWithQueries - remove chars after ?
// export const ExchangeRateList = () => {
//   const [currencyFrom, setCurrencyFrom] = useState<Currencies>("EUR");
//   const [currencyTo, setCurrencyTo] = useState<Currencies>("CZK");

//   const [currencyEndpoint, setCurrencyEndpoint] =
//     useStableState<EXCHANGE_RATE_ENDPOINT_WITH_QUERIES>(
//       "https://api.frankfurter.app/latest?from=USD&to=CZK"
//     );

//   const [rate, setRate] = useStableState<number>(0); //use ref

//   const [isCurrencyEquals, setIsCurrencyEquals] = useState(false);

//   const validateCurrencyOption = (
//     currency: string
//   ): E.Either<Error, Currencies> =>
//     pipe(
//       currency,
//       E.fromPredicate(
//         isCurrency,
//         (nonCurrency) => new Error(`Non valid currency ${nonCurrency}`)
//       )
//     );

//   const handleCurrencyChange = ({ setter }: CurrencySetter) =>
//     flow(
//       validateCurrencyOption,
//       E.fold<Error, Currencies, IO.IO<void>>(
//         log,
//         (currency) => () => setter(currency)
//       )
//     );

//   const handleSelectChange =
//     (currencySetter: CurrencySetter) =>
//     (e: React.ChangeEvent<HTMLSelectElement>) =>
//       pipe(e.target.value, handleCurrencyChange(currencySetter))();

//   //  TODO
//   //  filter non-existing queries ?from=USD&to=USD
//   const endpoint = createEndpoint({
//     endpoint: EXCHANGE_RATE_ENDPOINT,
//     path: EXCHANGE_RATE_ENDPOINT_PATH,
//     query: {
//       delimiter: EXCHANGE_RATE_ENDPOINT_QUERY_DELIMITER,
//       keys: ["from", "to"],
//       values: [currencyFrom, currencyTo],
//     },
//   });

//   // const l: EXCHANGE_RATE_ENDPOINT_WITH_QUERIES = endpoint;

//   //  Set newly created endpoint - side effect like IO
//   useEffect(() => {
//     console.log(
//       "createEndpoint",
//       "currencyFrom !== currencyTo",
//       currencyFrom !== currencyTo
//     );
//     const res =
//       currencyFrom !== currencyTo
//         ? pipe(
//             createEndpoint({
//               endpoint: EXCHANGE_RATE_ENDPOINT,
//               path: EXCHANGE_RATE_ENDPOINT_PATH,
//               query: {
//                 delimiter: EXCHANGE_RATE_ENDPOINT_QUERY_DELIMITER,
//                 keys: ["from", "to"],
//                 values: [currencyFrom, currencyTo],
//               },
//             }),
//             IOE.fromPredicate(
//               isExchangeRateEndpointWithQueries,
//               (str) => new Error(`Exchange rate endpoint is not valid: ${str}`)
//             ),
//             IOE.fold(log, setCurrencyEndpoint)
//           )()
//         : setRate(1)();
//   }, [currencyFrom, currencyTo, setCurrencyEndpoint, setRate]);

//   //  execute fetch and setRate
//   //  TODO
//   // refactor fetchCurrency - currencyTo use to get data from response object
//   useEffect(() => {
//     console.log("-----------");
//     console.log("currencyEndpoint changed", currencyEndpoint);
//     console.log("currencyFrom", currencyFrom);
//     console.log("currencyTo", currencyTo);
//     console.log("-----------");

//     const fetchCurrencyTest = pipe(
//       TE.of(currencyEndpoint),
//       TE.chain(fetchCurrency),
//       TE.fold(flow(log, T.fromIO), ({ rates: { CZK } }) =>
//         pipe(CZK, setRate, T.fromIO)
//       )
//     )();

//     // const l = fetchCurrencyTest();
//     console.log("after fetched data - promise", l);
//   }, [currencyEndpoint]);

//   useEffect(() => {
//     console.log("rate changed", rate);
//   }, [rate]);

//   return (
//     <div className="exchange-rate-list">
//       <h1>Exchange Rate List</h1>
//       <form action="">
//         <div className="form-field">
//           <label htmlFor="currency-select-from">Currency from:</label>
//           <select
//             name="currency-select-from"
//             id="currency-select-from"
//             onChange={handleSelectChange({ setter: setCurrencyFrom })}
//             value={currencyFrom}
//           >
//             {pipe(
//               currencies,
//               createOptions((valOption) => (
//                 <option value={valOption} key={valOption}>
//                   {valOption}
//                 </option>
//               ))
//             )}
//           </select>
//         </div>
//         <div className="form-field">
//           <label htmlFor="currency-select-to">Currency to:</label>
//           <select
//             name="currency-select-to"
//             id="currency-select-to"
//             onChange={handleSelectChange({ setter: setCurrencyTo })}
//             value={currencyTo}
//           >
//             {pipe(
//               currencies,
//               createOptions((valOption) => (
//                 <option value={valOption} key={valOption}>
//                   {valOption}
//                 </option>
//               ))
//             )}
//           </select>
//         </div>
//       </form>
//       <Rate from={currencyFrom} to={currencyTo} rate={rate} />
//     </div>
//   );
// };

// type MenuItemProps = {
//   text: string;
//   onSelectItem: (text: string) => void;
// };

// export const MenuItem = ({ text, onSelectItem }: MenuItemProps) => {
//   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) =>
//     onSelectItem(text);

//   return (
//     <a href="#" className="menu__item" onClick={handleLinkClick}>
//       {text}
//     </a>
//   );
// };

// export const Menu = () => {
//   const { value: isMenuClosed, toggle } = useToggle(true);

//   const [page, setPage] = useState("Home");

//   const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) =>
//     toggle();

//   const handleMenuItemClick = (text: string) => {
//     toggle();
//     setPage(text);
//   };

//   const menuClassName = classNames({
//     menu: true,
//     "menu--closed": isMenuClosed,
//   });
//   console.log("menuClassName", menuClassName);
//   return (
//     <>
//       <header>
//         <div className={menuClassName}>
//           <button className="menu__button" onClick={handleButtonClick}></button>
//           <div className="menu__items">
//             <MenuItem text="Home" onSelectItem={handleMenuItemClick} />
//             <MenuItem text="Services" onSelectItem={handleMenuItemClick} />
//             <MenuItem text="Our team" onSelectItem={handleMenuItemClick} />
//             <MenuItem text="Blog" onSelectItem={handleMenuItemClick} />
//             <MenuItem text="Contact" onSelectItem={handleMenuItemClick} />
//           </div>
//         </div>
//       </header>
//       <main>
//         <h1>{page}</h1>
//       </main>
//     </>
//   );
// };

// type Smiley =
//   | "smileyYes"
//   | "smileyStrongYes"
//   | "smileyNeutral"
//   | "smileyNo"
//   | "smileyStrongNo";
// type SymbolContent = "symbolQuestion" | "symbolTick";

// type SmileyContentProps = {
//   type: Smiley;
// };
// const SmileyContent = ({ type }: SmileyContentProps) => {
//   let d = undefined;

//   if (type === "smileyYes") {
//     d =
//       "M 141.62986,124.11544 A 48.216164,48.216179 0 0 1 99.873435,148.22353 48.216164,48.216179 0 0 1 58.117013,124.11544";
//   } else if (type === "smileyStrongYes") {
//     d =
//       "M 145.8564,116.12287 A 48.216164,53.573532 0 0 1 99.892118,153.58088 48.216164,53.573532 0 0 1 53.901722,116.16246 m -0.101509,-0.0831 c 29.09283,-6.43568 59.458677,-7.82227 92.146447,0";
//   } else if (type === "smileyNeutral") {
//     d = "M 67.726167,132.14468 H 132.01085";
//   } else if (type === "smileyNo") {
//     d =
//       "m 67.726167,148.21585 c 0,-21.42823 26.785283,-42.85645 64.284683,-32.14234";
//   } else if (type === "smileyStrongNo") {
//     d =
//       "m 141.62305,139.87305 c -8.6128,-14.91675 -24.52922,-24.10566 -41.753909,-24.10547 -17.224684,-1.9e-4 -33.141103,9.18872 -41.753907,24.10547";
//   }

//   return (
//     <>
//       <g className="smiley-eyes">
//         <circle cx="70" cy="75" r="12" />
//         <circle cx="130" cy="75" r="12" />
//       </g>

//       <path className="smiley-mouth" d={d} />
//     </>
//   );
// };

// type SymbolContentProps = {
//   type: SymbolContent;
// };
// const SymbolContent = ({ type }: SymbolContentProps) => {
//   if (type === "symbolQuestion") {
//     return (
//       <>
//         <path
//           fill="none"
//           strokeWidth="8"
//           d="m 73.083205,78.57419 c 10e-6,-14.79308 11.992188,-26.78528 26.785285,-26.78528 14.7931,0 26.78528,11.9922 26.78528,26.78528 0,21.42823 -26.78528,16.07117 -26.78528,37.4994"
//         />
//         <circle fill="#5a5a5a" cx="100" cy="142" r="8" />
//       </>
//     );
//   }

//   if (type === "symbolTick") {
//     return (
//       <path
//         fill="none"
//         strokeWidth="8"
//         d="M 57.141863,94.671752 89.285972,126.81586 142.85949,73.242346"
//       />
//     );
//   }

//   return null;
// };

// type IconType = Smiley | SymbolContent;

// type IconProps = {
//   type: IconType;
// };

// const isSmiley = (str: string): str is Smiley =>
//   [
//     "smileyYes",
//     "smileyStrongYes",
//     "smileyNeutral",
//     "smileyNo",
//     "smileyStrongNo",
//   ].includes(str);

// const isSymbolContent = (str: string): str is SymbolContent =>
//   ["symbolQuestion", "symbolTick"].includes(str);

// const Icon = ({ type }: IconProps) => {
//   let content = null;

//   if (isSmiley(type)) {
//     content = <SmileyContent type={type} />;
//   } else if (isSymbolContent(type)) {
//     content = <SymbolContent type={type} />;
//   }

//   return (
//     <svg className="icon" viewBox="0 0 200 200">
//       <circle className="icon__circle" cx="100" cy="100" r="85" />
//       {content}
//     </svg>
//   );
// };

// //  TODO
// //  Do it in functional way
// const IconSecond = ({ type }: IconProps) => {
//   const contentVariant = [["smiley"]];

//   let content = null;

//   if (type.startsWith("smiley") && isSmiley(type)) {
//     content = <SmileyContent type={type} />;
//   } else if (type.startsWith("symbol") && isSymbolContent(type)) {
//     content = <SymbolContent type={type} />;
//   }

//   return (
//     <svg className="icon" viewBox="0 0 200 200">
//       <circle className="icon__circle" cx="100" cy="100" r="85" />
//       {content}
//     </svg>
//   );
// };

// type OptionProps = {
//   type: IconType;
//   text: string;
//   onOptionSelect: (val: React.SetStateAction<IconType>) => IO.IO<void>;
// };

// const Option = ({ type, text, onOptionSelect }: OptionProps) => {
//   const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) =>
//     onOptionSelect(type)();

//   return (
//     <div className="option" onClick={handleDivClick}>
//       <Icon type={type} />
//       <div>{text}</div>
//     </div>
//   );
// };

// type QuestionBodyProps = {
//   text: string;
//   iconType: IconType;
// };

// const QuestionBody = ({ text, iconType }: QuestionBodyProps) => {
//   return (
//     <div className="question__body">
//       <p className="question__text">{text}</p>
//       <Icon type={iconType} />
//     </div>
//   );
// };

// type QuestionProps = {
//   text: string;
// };

// export const Question = ({ text }: QuestionProps) => {
//   const [answer, setAnswer] = useStableState<IconType>("symbolQuestion");

//   const handleQuestionOption = flow(setAnswer);

//   return (
//     <div className="question">
//       <p>Answer: {answer}</p>
//       <QuestionBody iconType={answer} text={answer} />
//       <div className="question__options">
//         <Option
//           type={"smileyStrongYes"}
//           text={"agree"}
//           onOptionSelect={handleQuestionOption}
//         />
//         <Option
//           type={"smileyYes"}
//           text={"agree"}
//           onOptionSelect={handleQuestionOption}
//         />
//         <Option
//           type={"smileyNeutral"}
//           text={"dont know"}
//           onOptionSelect={handleQuestionOption}
//         />
//         <Option
//           type={"smileyNo"}
//           text={"dont agree"}
//           onOptionSelect={handleQuestionOption}
//         />
//         <Option
//           type={"smileyStrongNo"}
//           text={"dont agree"}
//           onOptionSelect={handleQuestionOption}
//         />
//       </div>
//     </div>
//   );
// };

export const Home = () => (
  <main style={{ padding: "1rem 0", backgroundColor: "blue" }}>
    <p>
      Welcome to our collection of quotes. Head over to{" "}
      <Link to={"/people"}>/people</Link>
    </p>
    <h1>Home</h1>
  </main>
);
export const About = () => (
  <main style={{ padding: "1rem 0", backgroundColor: "green" }}>
    <h1>About</h1>
  </main>
);
export const Users = () => (
  <main style={{ padding: "1rem 0", backgroundColor: "yellow" }}>
    <h1>Users</h1>
  </main>
);

export const Nav = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/users"}>Users</Link>
          </li>
          <li>
            <Link to={"/movies"}>Movies</Link>
          </li>
          <li>
            <Link to={"/invoices"}>invoices</Link>
          </li>
          <li>
            <Link to={"/expenses"}>expenses</Link>
          </li>
          <li>
            <Link to={"/filters"}>filters</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

type Movie = {
  id: string;
  title: string;
  description: string;
  img: string;
};

const movies: Movie[] = [
  {
    id: "love-is-all-around-us",
    title: "Láska Nebeská",
    description: "Film o velké lásce.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png",
  },
  {
    id: "cars-be-fast",
    title: "Rychlý auta",
    description: "Držte si cylindry!",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/72/Ford_Model_T_and_VW_type_11_Luxus%2C_Technisches_Museum_Wien%2C_Juni_2009.jpg",
  },
  {
    id: "pawsome-cats",
    title: "Meoww",
    description: "Víte, jak správně hladit kočku?",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
  },
];

type MovieMeProps = {
  movie: string;
};

export const MovieMe = ({ movie }: MovieMeProps) => {
  const params = useParams();
  console.log("MovieMe params", params);

  return <div className="movie">My favorite film is : {movie}</div>;
};

const findMovie = (id: string, movies: Movie[]) =>
  pipe(
    movies,
    A.findFirstMap((movie) => (movie.id === id ? O.some(movie) : O.none))
  );

export const Movie = () => {
  const { movieId } = useParams();
  console.log("params", movieId);

  const movieRecord = pipe(
    movieId,
    O.fromNullable,
    O.map((movieId) => [movieId, movies] as const),
    O.chain((args) => findMovie(...args)),
    O.fold(
      () => <p>Movie record is not defined.</p>,
      ({ id, description, img, title }) => (
        <>
          <h3>{id}</h3>
          <h4>{title}</h4>
          <p>{description}</p>
          <img src={img} alt={id} />
        </>
      )
    )
  );

  // id: "pawsome-cats",
  //   title: "Meoww",
  //   description: "Víte, jak správně hladit kočku?",
  //   img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",

  return <div className="movie">{movieRecord}</div>;
};

export const Movies = () => {
  const [favFilm, setFavFilm] = useStableState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFavFilm(e.target.value)();

  console.log("re-render Movies component", favFilm);

  return (
    <>
      <div className="movies">
        <h2>Movies!</h2>
        <p>Click to movie to show more information about film!</p>
        <ul>
          {movies.map((movie, index) => (
            <li key={index}>
              <Link to={`${movie.id}`}>{movie.id}</Link>
            </li>
          ))}
          <li>
            <Link to={`me`} state={{ text: favFilm }}>
              My movies
            </Link>
          </li>
        </ul>
        <div className="movies__form">
          <label htmlFor="fav-movie">Favourite movie:</label>
          <input
            type="text"
            id="fav-movie"
            value={favFilm}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Routes>
        <Route path=":movieId" element={<Movie />} />
        <Route path="me" element={<MovieMe movie={favFilm} />} />
      </Routes>
    </>
  );
};

const invoices = [
  {
    name: "Santa Monica",
    id: 1995,
    amount: "$10,800",
    due: "12/05/1995" as unknown as Date,
  },
  {
    name: "Stankonia",
    id: 2000,
    amount: "$8,000",
    due: "10/31/2000" as unknown as Date,
  },
  {
    name: "Ocean Avenue",
    id: 2003,
    amount: "$9,500",
    due: "07/22/2003" as unknown as Date,
  },
  {
    name: "Tubthumper",
    id: 1997,
    amount: "$14,000",
    due: "09/01/1997" as unknown as Date,
  },
  {
    name: "Wide Open Spaces",
    id: 1998,
    amount: "$4,600",
    due: "01/27/1998" as unknown as Date,
  },
];

type Invoice = typeof invoices[number];
type Invoices = Invoice[];

const getInvoices = () => invoices;

const createInvoicesLinks =
  (map: (invoice: Invoice) => React.ReactElement) => (invoices: Invoices) =>
    invoices.map(map);

// Helpers
const getUrlValueFromParams = ([key, params]: readonly [string, Params]) =>
  RR.lookup(key, params) as O.Option<string>;

const findItem =
  <T,>(predicate: Predicate<T>) =>
  (items: Array<T>) =>
    A.findFirst(predicate)(items);

// const findItemTest = <T,>(predicate: ) => (key: O.Option<string>) => (items: Array<T>) => pipe(key, O.chain());

// const createInvoiceElem = ([key, params]: readonly [string, Params]) => () => pipe(getUrlValueFromParams, ());

// export const Invoice = () => {
//   const params = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   console.log("invoice params", params);

//   const deleteInvoice = (id: number) =>
//     invoices.filter(({ number: invoiceId }) => id !== invoiceId);

//   const handleButtonClick =
//     (id: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
//       deleteInvoice(id);
//       navigate(`/invoices${location.search}`);
//     };

//   const invoiceElem = pipe(
//     ["invoiceId", params],
//     getUrlValueFromParams,
//     O.chain((val) =>
//       pipe(val, parseInt, (num) => (!isNaN(num) ? O.some(num) : O.none))
//     ),
//     O.map((val) => ({ val, invoices })),
//     O.chain(({ val, invoices }) =>
//       pipe(
//         invoices,
//         findItem(({ number }) => val === number)
//       )
//     ),
//     O.fold(
//       () => (
//         <>
//           <h4>Invoice does not exist</h4>
//           <Link to="/">Home page</Link>
//         </>
//       ),
//       ({ amount, due, name, number }) => (
//         <>
//           <h4>Total due: ${amount}</h4>
//           <p>
//             {name}: {number}
//           </p>
//           <p>Due date: {due}</p>
//           <button onClick={handleButtonClick(number)}>Delete invoice</button>
//         </>
//       )
//     )
//   );

//   return (
//     <div className="invoice">
//       <h3>Invoice info</h3>
//       {invoiceElem}
//     </div>
//   );
// };

export const Invoice = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("invoice params", params);

  const deleteInvoice = (id: number) =>
    invoices.filter(({ id: invoiceId }) => id !== invoiceId);

  const handleButtonClick =
    (id: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      deleteInvoice(id);
      navigate(`/invoices${location.search}`);
    };

  const invoiceElem = pipe(
    ["invoiceId", params],
    getUrlValueFromParams,
    O.chain((val) =>
      pipe(val, parseInt, (num) => (!isNaN(num) ? O.some(num) : O.none))
    ),
    O.map((val) => ({ val, invoices })),
    O.chain(({ val, invoices }) =>
      pipe(
        invoices,
        findItem(({ id }) => val === id)
      )
    ),
    O.fold(
      () => (
        <>
          <h4>Invoice does not exist</h4>
          <Link to="/">Home page</Link>
        </>
      ),
      ({ amount, due, name, id }) => (
        <>
          <h4>Total due: ${amount}</h4>
          <p>
            {name}: {id}
          </p>
          <p>Due date: {due}</p>
          <button onClick={handleButtonClick(id)}>Delete invoice</button>
        </>
      )
    )
  );

  return (
    <div className="invoice">
      <h3>Invoice info</h3>
      {invoiceElem}
    </div>
  );
};

type InferReactComponentProps<T> = T extends React.ComponentType<infer Props>
  ? Props extends object
    ? Props
    : never
  : never;

type BrandLinkProps = { brand: number } & InferReactComponentProps<typeof Link>;

const BrandLink = ({ brand, children, ...props }: BrandLinkProps) => {
  const [params] = useSearchParams();

  const isActive = params.get("filter")?.includes(String(brand));

  console.log("isActive", isActive);
  console.log("BrandLink search params", params.getAll("filter"));
  return (
    <Link
      {...props}
      to={`?filter=${brand}`}
      className={isActive ? "link--active" : "link"}
    >
      {children}
    </Link>
  );
};

// export const Invoices = () => {
//   const invoices = getInvoices();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const location = useLocation();

//   const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     pipe(
//       e.target.value,
//       O.fromPredicate((str) => str.length > 0),
//       O.map((str) => ({ filter: str })),
//       O.fold(
//         () => () => setSearchParams({}),
//         (searchParams) => () => setSearchParams(searchParams)
//       )
//     )();

//   console.log("searchParams", searchParams.toString());
//   console.log("location", location);

//   return (
//     <>
//       <div className="container">
//         <h2>Invoices</h2>
//         <main>
//           <input
//             type="text"
//             value={searchParams.get("filter") || ""}
//             onChange={handleInputTextChange}
//           />
//         </main>
//         <nav>
//           <ul>
//             {pipe(
//               invoices,
//               A.filter((invoice) => {
//                 const filter = searchParams.get("filter");

//                 if (!filter) return true;
//                 const name = invoice.name.toLocaleLowerCase();
//                 return name.startsWith(filter.toLocaleLowerCase());
//               }),
//               // createInvoicesLinks(({ name, number }) => (
//               //   <BrandLink brand={number} key={`${number}`} to={""}>
//               //     {name}
//               //   </BrandLink>
//               // ))
//               createInvoicesLinks(({ name, number }) => (
//                 <NavLink
//                   className={({ isActive }) =>
//                     !isActive ? "link" : "link--active"
//                   }
//                   to={`${number}${location.search}`}
//                   key={`${number}`}
//                 >
//                   {name}
//                 </NavLink>
//               ))
//             )}
//           </ul>
//         </nav>
//       </div>
//       <Outlet />
//     </>
//   );
// };

// type UrlSearchParamsRecord = URLSearchParams & {key: string; values: string[]; searchParam: string};
// dependency - searchParams: URLSearchParams
type UrlSearchParamsRecord = {
  values: string[];
  urlValue: string;
};

//  String helpers
const containsString = (urlVal: string) =>
  A.some<string>((val) => val === urlVal);

const appendToStrings = (urlVal: string) => (urlValues: string[]) =>
  [...urlValues, urlVal];
const filterStrings = (urlVal: string) => (urlValues: string[]) =>
  urlValues.filter(
    (val) => val.toLocaleLowerCase() !== urlVal.toLocaleLowerCase()
  );

const handleUrlSearchNonExist = flow(appendToStrings);
const handleUrlSearchExist = flow(filterStrings);

const handleUrlSearchChange =
  (
    onNone: (urlValue: string) => (values: string[]) => string[],
    onSome: (
      urlValue: string
    ) => (values: NEA.NonEmptyArray<string>) => string[]
  ) =>
  ({ values, urlValue }: UrlSearchParamsRecord) =>
    pipe(
      values,
      E.fromPredicate(containsString(urlValue), identity),
      E.fold(onNone(urlValue), onSome(urlValue))
    );

const createKeyValue = (key: string) => (value: string) => [key, value];

const createUniqueSearchParams = (key: string) =>
  flow(
    handleUrlSearchChange(handleUrlSearchNonExist, handleUrlSearchExist),
    A.map(createKeyValue(key)),
    (params) => new URLSearchParams(params)
  );

type SearchParamsUpdater = (
  nextInit: URLSearchParamsInit,
  navigateOptions?:
    | {
        replace?: boolean | undefined;
        state?: any;
      }
    | undefined
) => void;

const updateSearchParams =
  (updater: SearchParamsUpdater) =>
  (urlSearchParamInit: URLSearchParamsInit): IO.IO<void> =>
  () =>
    updater(urlSearchParamInit);

//  Can create others search params filters like brand
const createFilterSearchParams = createUniqueSearchParams("filter");

const getSearchParams =
  (key: string) =>
  (urlSearchParams: URLSearchParams): IO.IO<Array<string>> =>
  () =>
    urlSearchParams.getAll(key);
const mapSearchParamsToString = (delimiter: string) => (params: string[]) =>
  params.join(delimiter);

export const Invoices = () => {
  const invoices = getInvoices();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    pipe(
      e.target.value,
      O.fromPredicate((str) => str.length > 0),
      O.map((str) => ({ filter: str })),
      O.fold(
        () => () => setSearchParams({}),
        (searchParams) => () => setSearchParams(searchParams)
      )
    )();

  console.log("Invoices - searchParams ", searchParams.toString());
  console.log("Invoices - location", location);

  //  TODO
  //  handleInputTextChange refactor
  //  search invoices by filter

  return (
    <>
      <div className="container">
        <h2>Invoices</h2>
        <main>
          <input
            type="text"
            value={pipe(
              searchParams,
              IO.of,
              IO.chain(getSearchParams("filter")),
              IO.map(mapSearchParamsToString(", "))
            )()}
            onChange={handleInputTextChange}
          />
        </main>
        <nav>
          <ul>
            {pipe(
              invoices,
              // A.filter((invoice) => {
              //   const filter = searchParams.get("filter");

              //   if (!filter) return true;
              //   const name = invoice.name.toLocaleLowerCase();
              //   return name.startsWith(filter.toLocaleLowerCase());
              // }),
              // createInvoicesLinks(({ name, number }) => (
              //   <BrandLink brand={number} key={`${number}`} to={""}>
              //     {name}
              //   </BrandLink>
              // ))
              createInvoicesLinks(({ name, id }) => (
                <NavLink
                  className={({ isActive }) =>
                    !isActive ? "link" : "link--active"
                  }
                  onClick={(evt) => {
                    evt.preventDefault();

                    const urlSearchParamsRec: UrlSearchParamsRecord = {
                      urlValue: name.toLocaleLowerCase(),
                      values: searchParams.getAll("filter"),
                    };

                    return pipe(
                      urlSearchParamsRec,
                      createFilterSearchParams,
                      updateSearchParams(setSearchParams)
                    )();
                  }}
                  to={{
                    pathname: `/invoices`,
                    search: `${location.search}`,
                  }}
                  key={`${id}`}
                >
                  {id}: {name}
                </NavLink>
              ))
            )}
          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
};

type InvoiceFilterableListProps = {
  invoices: Invoices;
};

const stringEq: EQ.Eq<string> = { equals: (x, y) => x === y };
const numberEq: EQ.Eq<number> = { equals: (x, y) => x === y };
const dateEq: EQ.Eq<Date> = { equals: (x, y) => x === y };
const invoiceEq = EQ.struct<Invoice>({
  amount: stringEq,
  due: dateEq,
  id: numberEq,
  name: stringEq,
});

const invociesEq = A.getEq(invoiceEq);
type InvociesEq = typeof invociesEq;

type OrderAscending = "ascending";
type OrderDescending = "descending";
type SortOrder = OrderAscending | OrderDescending;

const isSortOrderVariant = (str: unknown): str is SortOrder =>
  str === "ascending" || str === "descending";
const isSortActionOrder = (sortAction: SortAction) =>
  sortAction === "sort-order";

type SortAction = "sort-order" | "sort-key";
type SortConfig = {
  order: SortOrder;
  key: string;
};

const SORT_CONFIG = {
  key: "name",
  order: "ascending",
} as SortConfig;

const FILTER_CONFIG = {
  initState: invoices,
};

export const TestComponent = () => {
  const [sortConfig, setSortConfig] = useStableState<SortConfig>(
    () => SORT_CONFIG,
    {
      equals: (x, y) => x.order === y.order && x.key === y.key,
    }
  );

  const [query, setQuery] = useStableState<string>(() => "");
  // const { data } =
  //   useFilter<Invoice>({
  //     initialState: [
  //       {
  //         name: "Tubthumper",
  //         id: 1997,
  //         amount: "$14,000",
  //         due: "09/01/1997" as unknown as Date,
  //       },
  //       {
  //         name: "Wide Open Spaces",
  //         id: 1998,
  //         amount: "$4,600",
  //         due: "01/27/1998" as unknown as Date,
  //       },
  //     ],
  //     eqState: { equals: (x, y) => x === y },
  //     initialFiltersRules: [
  //       { key: "name", name: "Tubthumper" },
  //       { key: "id", name: 1997 },
  //     ],
  //     eqFiltersRules: [{ equals: (x, y) => x === y }],
  //   });

  const changeSortConfigKey = (key: string) =>
    setSortConfig(({ order }) => ({ key, order }));
  const changeSortConfigOrder = (order: SortOrder) =>
    setSortConfig(({ key }) => ({ order, key }));
  // const handleSortConfigChange = (sortAction: SortAction) => (val: string | SortOrder) => sortAction === 'sort-order' ? changeSortConfigOrder(): changeSortConfigKey();

  const handleSelectChange =
    (sortAction: SortAction) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      pipe(e.target.value, (val) =>
        isSortActionOrder(sortAction) && isSortOrderVariant(val)
          ? changeSortConfigOrder(val)
          : changeSortConfigKey(val)
      );

  const handleSelectChangeIO =
    (sortAction: SortAction) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      IO.Chain.chain(IO.of(e), handleSelectChange(sortAction))();

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value)();

  //  Side effects

  // useEffect(() => {
  //   console.log(
  //     "filter() - items",
  //     filter(
  //       ({ name }) =>
  //         name.toLocaleLowerCase() === "Santa Monica".toLocaleLowerCase()
  //     )()
  //   );
  // }, []);
  console.log("testComponent re-rendered - items", "items");

  useEffect(() => {
    console.log("testComponent - filter-query changed", query);
  }, [query]);

  useEffect(() => {
    console.log("testComponent - items changed");
  }, []);

  useEffect(() => {
    console.log("testComponent - sort order changed", sortConfig.order);
  }, [sortConfig.order]);

  useEffect(() => {
    console.log("testComponent - sort key changed", sortConfig.key);
  }, [sortConfig.key]);

  const { key, order } = sortConfig;
  return (
    <div className="container">
      <div>
        <div>
          <label htmlFor="invoices-sort">
            Select option to sort data by:
            <select
              name="invoices-sort-key"
              id="invoices-sort"
              onChange={handleSelectChangeIO("sort-key")}
              value={key}
            >
              <option value="name">name</option>
              <option value="id">id</option>
              <option value="amount">amount</option>
              <option value="due">due</option>
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="invoices-sort-order">
            Select option to sort data in order:
            <select
              name="invoices-sort-order"
              id="invoices-sort-order"
              onChange={handleSelectChangeIO("sort-order")}
              value={order}
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="invoices-filter-query">
            Write query to filter records:
            <input
              type="text"
              name="invoices-filter-query"
              id="invoices-filter-query"
              onChange={handleInputTextChange}
              value={query}
            />
          </label>
        </div>
      </div>
      <div>
        <table>
          <colgroup span={4}></colgroup>
          <tbody>
            <tr>
              <th>ID: </th>
              <th>Name: </th>
              <th>Amount: </th>
              <th>Due: </th>
            </tr>
            {[
              {
                name: "Santa Monica",
                id: 1995,
                amount: "$10,800",
                due: "12/05/1995" as unknown as Date,
              },
              {
                name: "Stankonia",
                id: 2000,
                amount: "$8,000",
                due: "10/31/2000" as unknown as Date,
              },
            ].map(({ amount, due, name, id }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{amount}</td>
                <td>{due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const InvoiceFilterableList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("InvoiceFilterableList params", params);

  const deleteInvoice = (id: number) =>
    invoices.filter(({ id: invoiceId }) => id !== invoiceId);

  const handleButtonClick =
    (id: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      deleteInvoice(id);
      navigate(`/invoices${location.search}`);
    };

  const invoiceElem = pipe(
    ["invoiceId", params],
    getUrlValueFromParams,
    O.chain((val) =>
      pipe(val, parseInt, (num) => (!isNaN(num) ? O.some(num) : O.none))
    ),
    O.map((val) => ({ val, invoices })),
    O.chain(({ val, invoices }) =>
      pipe(
        invoices,
        findItem(({ id }) => val === id)
      )
    ),
    O.fold(
      () => (
        <>
          <h4>Invoice does not exist</h4>
          <Link to="/">Home page</Link>
        </>
      ),
      ({ amount, due, name, id }) => (
        <>
          <h4>Total due: ${amount}</h4>
          <p>
            {name}: {id}
          </p>
          <p>Due date: {due}</p>
          <button onClick={handleButtonClick(id)}>Delete invoice</button>
        </>
      )
    )
  );

  return (
    <div className="invoice">
      <h3>Invoice info</h3>
      {invoiceElem}
    </div>
  );
};

export const Expenses = () => {
  return <h2>Expenses</h2>;
};

export const Page404 = () => {
  const navigate = useNavigate;

  return (
    <>
      <p className="alert">There is nothing here!</p>
      <Link to="/">return to homepage</Link>
    </>
  );
};

{
  /* <div className="container">
<main id="main" role="main" className="content">
  <h1>
    Nadpis první úrovně. Lorem ipsum světelných hlavním rozevře, nedávný
    přišpendlila dospělého
  </h1>

  <p>
    Lorem ipsum až mlze kohoutku něj, světový z postupující, nim do ovládá
    je směr organizace nějaké u matriarchálně jasně v řádu slabí ztěžuje,
    jim i mj. zvládnete někdy k zelené, čím 5300 m n.m. všeobecně bílý, a
    o tezi z tak světlých se napětí mozek. Rozmachu listopadovém podobný
    teď. Spešl díky pro <a href="http://cs.blabot.net/">Odkaz</a>.
  </p>

  <h2>
    Jsou tady různé HTML elementy. Testujeme se, zda nastavení typografie
    řeší všechny jejich kombinace
  </h2>

  <p>
    Lorem ipsum Zemi dvě ujít jste šest s 2012 vlajících, míra tvar
    rezervaci profese. Viru ze vlivů soudci obzoru po hned masy u
    katastrofě. Lanovek předpoklad naplánoval by mj. laboratoře vstupuje
    ostře prostoročase ze o Michal spíš 5300 m n.m. létě k viru.{" "}
  </p>

  <figure>
    <img src="http://satyr.io/1600x900" alt="ukázkový obrázek" />
    <figcaption>
      Obrázek 12: Lorem Ipsum molekulou spolupracuje v ohřívání, mě
      rozvojem.
    </figcaption>
  </figure>

  <p>
    Liška bukovým vynesl neobejdou samé komunitních duhový, sem tahy
    dánského mým pochopitelně mapuje. Tvar co pochopily 200 geometrické
    orgánu, pro o narušení vajíček jehož kronik do je zárodky vývoji.
  </p>

  <h2>
    Tohle je třeba děsně dlouhý nadpis druhé úrovně, že jo. Unikátní
    docházet 320denní se zemskou agenturou, nájem jasně nacházejí vznikl
    annan
  </h2>

  <p>
    Liška bukovým vynesl neobejdou samé komunitních duhový, sem tahy
    dánského mým pochopitelně mapuje. Tvar co pochopily 200 geometrické
    orgánu, pro o narušení vajíček jehož kronik do je zárodky vývoji.
  </p>

  <p>
    Myší že dopluli, čem, informaci EU mi ráno bizarnímu někdy rozšířeným
    vyprávějí povely do. Výjimkou či takřka, ony zmizely spatřovali, k
    užitečných na z rámci mobilního začala, podlouhlým za všechny, i mor
    ke vlna tito s veřejně s neřeknou.{" "}
  </p>

  <pre className=" language-css">
    <code className=" language-css">
      <span className="token selector">:root</span>{" "}
      <span className="token punctuation">{}</span>
      <span className="token property">--colorPrimary</span>
      <span className="token punctuation">:</span> red
      <span className="token punctuation">;</span>
      <span className="token punctuation">{}</span>
      <span className="token selector">a</span>{" "}
      <span className="token punctuation">{}</span>
      <span className="token property">color</span>
      <span className="token punctuation">:</span>{" "}
      <span className="token function">var</span>
      <span className="token punctuation">(</span>--colorPrimary
      <span className="token punctuation">)</span>
      <span className="token punctuation">;</span>
      <span className="token punctuation">{}</span>
    </code>
  </pre>

  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut dolores
    aliquid rem architecto, modi tempora consequatur ipsum error quod
    earum! Consequuntur culpa repellat soluta cumque dolorem quod nesciunt
    nulla fugiat.
  </p>

  <h3>Obrázek ve figure/figcaption</h3>

  <figure>
    <img src="http://satyr.io/1600x900" alt="ukázkový obrázek" />
    <figcaption>
      Obrázek 22: Lorem Ipsum Má EU je. Některých teplotním čtyři naše
      zmiňuje nepřestat u molekulou spolupracuje v ohřívání, mě rozvojem.
    </figcaption>
  </figure>

  <p>
    Má EU je. Některých teplotním čtyři naše zmiňuje nepřestat u molekulou
    spolupracuje v ohřívání, mě rozvojem.{" "}
  </p>

  <p>
    Současné ta v mění horké půjdu návštěvníků obyvatel nic přicházejí
    zahladila, terénních zdi ze proběhlo krakonošovým plynu křídla k razí
    část, 750 to a mění navštěvovat evropě provazovce institut budoucna.
  </p>

  <h3>Nadpis třetí úrovně krátký</h3>

  <p>
    Lorem ipsum dolor sit amet, staří dokáže, ovce ke. Východním k
    vyrazili, většinu patří zmražených poslouchá přijata, místech
    spotřebuje tvoří důležitý mamutů, úrodnou uspoří můžeme lodi trávy.
    Jsou, 523 horské. Problémy osoba?
  </p>

  <pre className=" language-css">
    <code className=" language-css">
      <span className="token comment" spellCheck="true">
        komponenta z node_modules:
      </span>
      <span className="token atrule">
        <span className="token rule">@import</span>{" "}
        <span className="token string">`&quot;normalize.css</span>
        <span className="token punctuation">;</span>
      </span>
      <span className="token comment" spellCheck="true">
        relativní cesta:
      </span>
      <span className="token atrule">
        <span className="token rule">@import</span>{" "}
        <span className="token string">`&quot;./theme.css`&quot;</span>
        <span className="token punctuation">;</span>
      </span>
      <span className="token comment" spellCheck="true">
        import všech souborů v adresáři:
      </span>
      <span className="token atrule">
        <span className="token rule">@import</span>{" "}
        <span className="token string">
          `&quot;./components.css`&quot;
        </span>
        <span className="token punctuation">;</span>
      </span>{" "}
    </code>
  </pre>

  <p>
    Liška bukovým vynesl neobejdou samé komunitních duhový, sem tahy
    dánského mým pochopitelně mapuje. Tvar co pochopily 200 geometrické
    orgánu, pro o narušení vajíček jehož kronik do je zárodky vývoji.
  </p>

  <h3>
    Nadpis třetí úrovně dlouhý. Mor EU 862 propadnout získávání odpoledne
    oddané traektorii si zemědělstvím
  </h3>

  <blockquote>
    <p>
      Tohle je <code>blockquote</code> s <em>jedním</em> odstavcem. Lorem
      ipsum dvě ujít jste šest s 2012 vlajících, míra tvar{" "}
      <strong>rezervaci</strong> profese. Viru ze vlivů soudci obzoru po
      hned masy u katastrofě.
    </p>
  </blockquote>

  <h2>Seznamy</h2>

  <p>
    Odstavec před <strong>nečíslovaným</strong> seznamem (<code>ul</code>
    ). Lorem ipsum naši že stylovou uveřejněném zvíře s těžkou u jakýsi
    dní dál nabídka pohyb k hlavně. Převýšení půlkilometrová cestu všemi o
    nebe, ta té a závisí neředěnou informují indie permanentek.
  </p>

  <ul>
    <li>První.</li>
    <li>Druhý.</li>
    <li>
      Třetí. Lorem ipsum dvě ujít jste šest s 2012 vlajících, míra tvar{" "}
      <strong>rezervaci</strong> profese. Viru ze vlivů soudci obzoru po
      hned masy u katastrofě.
    </li>
    <li>
      Čtvrtý. Lorem ipsum vlajících, míra tvar rezervaci <em>profese</em>.
      Viru ze vlivů soudci obzoru po hned masy u katastrofě.
    </li>
  </ul>

  <p>
    Odstavec před <strong>číslovaným</strong> seznamem (<code>ol</code>).
    Lorem ipsum naši že stylovou uveřejněném zvíře s těžkou u jakýsi dní
    dál nabídka pohyb k hlavně. Převýšení půlkilometrová cestu všemi o
    nebe, ta té a závisí neředěnou informují indie permanentek.
  </p>

  <ol>
    <li>První.</li>
    <li>Druhý.</li>
    <li>
      Třetí. Lorem ipsum dvě ujít jste šest s 2012 vlajících, míra tvar{" "}
      <strong>rezervaci</strong> profese. Viru ze vlivů soudci obzoru po
      hned masy u katastrofě.
    </li>
    <li>
      Čtvrtý. Lorem ipsum vlajících, míra tvar rezervaci <em>profese</em>.
      Viru ze vlivů soudci obzoru po hned masy u katastrofě.
    </li>
    <li>Pátá</li>
    <li>Šestá</li>
    <li>Sedmá</li>
    <li>Osmá</li>
    <li>Devátá</li>
    <li>Desátá</li>
    <li>Jedenáctá</li>
  </ol>

  <h2>Tabulky</h2>

  <p>
    Tabulka s caption. Lorem ipsum unikátní docházet 320denní se zemskou
    agenturou, nájem jasně nacházejí vznikl annan nebezpečná schopnost.
  </p>

  <table summary="each row names a nordic country and specifies its total area and land area, in square kilometers">
    <caption>Název tabulky: Porovnání severských zemí </caption>
    <tbody>
      <tr>
        <th>Země</th>
        <th>Celková plocha m</th>
        <th>Plocha země</th>
        <th>Počet obyvatel</th>
      </tr>
      <tr>
        <th>Dánsko</th>
        <td>43 070</td>
        <td>42 370</td>
        <td>7 230 000</td>
      </tr>
      <tr>
        <th>Finsko</th>
        <td>337 030</td>
        <td>305 470</td>
        <td>17 830 000</td>
      </tr>
      <tr>
        <th>Island</th>
        <td>103,000</td>
        <td>100,250</td>
        <td>5 230 000</td>
      </tr>
      <tr>
        <th>Norsko</th>
        <td>324 220</td>
        <td>307 860</td>
        <td>18 200 000</td>
      </tr>
      <tr>
        <th>Švédsko</th>
        <td>449 964</td>
        <td>410 928</td>
        <td>28 570 000</td>
      </tr>
    </tbody>
  </table>
</main>
</div> */
}
