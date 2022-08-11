import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Reducer,
  useReducer,
} from "react";
import * as A from "fp-ts/Array";
import { Predicate } from "fp-ts/Predicate";
import * as ORD from "fp-ts/Ord";
import * as EQ from "fp-ts/Eq";
import * as RE from "fp-ts/Record";
import { identity, pipe, flow } from "fp-ts/lib/function";
import { useStableState } from "../useStableState";
import * as IO from "fp-ts/IO";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as NEA from "fp-ts/NonEmptyArray";

import { InitialState, PrimitiveValues, ReferenceValues } from "../../utils";
import { unknown } from "io-ts";

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

// type Filter<T> = T extends PrimitiveValues
//   ? FilterPrimitiveValues<T>
//   : T extends Record<string, unknown>
//   ? FilterReferenceValues<T>
//   : never;

// export type FilterPrimitiveValues<T extends PrimitiveValues> = T[];

// //  TODO
// //  Recursive check of nested objects
// export type FilterReferenceValues<
//   T extends Record<string, unknown> | unknown[]
// > = T extends Record<string, unknown>
//   ? {
//       [K in keyof T]?: T[K][];
//     }
//   : T[];

// type InferEntity<A> = A extends Array<infer T> ? T : never;

// const test = <Data extends unknown[], Filter extends InferEntity<Data>>(
//   data: Data,
//   obj: Filter
// ) => obj;
// // const p = test(invoices, { amount: "" });

// // type P1 = FilterVariant<1>;

// // export type SearchConfig<
// //   Record,
// //   RecordKey extends keyof Record = keyof Record
// // > = {
// //   query: Record[RecordKey];
// //   properties: Array<RecordKey>;
// // };

// // type P2 = SearchConfig<typeof invoices[1]>;
// type Invoice = typeof invoices[0];

// type FilterActions<
//   Rec extends Record<string, unknown>,
//   FilterRecord extends Filter<Rec> = Filter<Rec>,
//   FilterFields extends keyof Rec = keyof Rec
// > =
//   | {
//       type: "setFilter";
//       payload: FilterRecord;
//     }
//   | {
//       type: "removeFilter";
//     }
//   | {
//       type: "removeFilterFields";
//       payload: FilterFields[];
//     }
//   | {
//       type: "removeFilterFieldsValues";
//       payload: FilterRecord;
//     }
//   | {
//       type: "toggleFilter";
//       payload: FilterRecord;
//     };

// type p = FilterActions<Invoice>;

// const l: p = { type: "setFilter", payload: { amount: { values: ["1"] } } };

// interface FilterState<Data, Rec extends Record<string, unknown>> {
//   filter: Filter<Rec>;
//   state: Data[];
//   filteredState: Data[];
// }

// //  TODO
// //  Allow to accept array of tuples
// type FilterStructure<T> = T extends Record<string, unknown>
//   ? FilterReferenceValues<T>
//   : T extends PrimitiveValues
//   ? FilterPrimitiveValues<T>
//   : never;

// type FilterBase<Data, Entity extends InferEntity<Data> = InferEntity<Data>> = {
//   filterBy: FilterStructure<Entity>;
//   shouldHighlight?: boolean;
// };

// type DataStructure<T> = {
//   data: T;
// };

// type EqualityChecker<T> = {
//   equalityData: EQ.Eq<Array<T>>;
//   equalityFilter: T extends PrimitiveValues
//     ? EQ.Eq<FilterPrimitiveValues<T>[]>
//     : T extends ReferenceValues
//     ? EQ.Eq<FilterReferenceValues<T>>
//     : never;
// };

// type FilterEquality<
//   Data,
//   Entity extends InferEntity<Data> = InferEntity<Data>
// > = FilterBase<Data> & DataStructure<Data> & EqualityChecker<Entity>;

// type ActionPayload =
//   | string
//   | number
//   | boolean
//   | Record<string, unknown>
//   | unknown[];
// type Action<Type extends string, Payload extends ActionPayload> = {
//   type: Type;
//   payload: Payload;
// };

// type FilterReducerMap<
//   Data extends unknown[],
//   Rec extends Record<string, unknown>,
//   Actions extends Action<string, ActionPayload>
// > = {
//   [K in keyof Actions["type"]]: Reducer<FilterState<Data, Rec>, Actions>;
// };

// // const filterReducerMap: ReducerMap<typeof invoices, { name: {
// //   values: ["Wide Open Spaces", 's'],
// // }, }, FilterActions<Invoice> > =

// function Test(a: { value: number }): number;
// function Test(a: number, b: number): number;
// function Test(a: number | { value: number }, b?: number): number {
//   if (b && typeof a === "number") {
//     return a + b;
//   }

//   return typeof a !== "number" ? a.value : 1;
// }

// // const p = Test();

// //  TODO
// //  build useFilter with reducer variant - DONE
// //  build useFilter with one filter interface - DONE
// //  build useFilter with two filters interfaces - primitive values and for reference values
// //  when dispatch action setFilter, provide also EQ type class for dispatched filter
// //  make work this hook without SearchConfig
// //
// //  validate input from form to the given value of field using brandend types or type guards, predicate
// //  createFilterFields - this element should have a responsibility of highlighting of searched text

// const isPrimitiveValue = (value: unknown): value is string | number | boolean =>
//   typeof value !== "object" &&
//   typeof value !== "symbol" &&
//   typeof value !== undefined;

// const isReferenceValue = (value: unknown): value is Record<string, unknown> =>
//   typeof value === "object";
// const isFilterForPrimitiveValues = <T extends PrimitiveValues>(
//   value: unknown
// ): value is FilterPrimitiveValues<T> =>
//   typeof value === "object" && value !== null && "values" in value;

// const FilterPrimitiveValuesMonoid = A.foldMap;

// //  TODO

// //  1.  CreateFilter
// //  filterBy - changing data type of value - object or array
// //  parameter data - T | FilterEquality

// //  2.  Reducer - state managment of useFIlter

// const isData = <T extends unknown[]>(data: T | FilterEquality<T>): data is T =>
//   Array.isArray(data);
// const isPrimitiveType = (elem: unknown): elem is PrimitiveValues =>
//   typeof elem === "string" ||
//   typeof elem === "number" ||
//   typeof elem === "boolean";
// const isDataPrimitiveType = (data: unknown[]): data is PrimitiveValues[] =>
//   pipe(
//     data,
//     A.head,
//     O.fold(() => false, isPrimitiveType)
//   );
// const isFilterEqualityTest = <T extends unknown[]>(
//   data: T | FilterEquality<T>
// ): data is FilterEquality<T> =>
//   !isData(data) && (data as FilterEquality<T>).data !== "undefined";

// const getValue =
//   <V>(k: string) =>
//   (r: Record<string, V>) =>
//     RE.lookup<V>(k, r);

// //  TODO
// //  examine this function
// // const p = <T extends unknown[]>(filter?: FilterBase<T>) =>
// //   pipe(filter, filter => filter ? pipe(filter, getValue<FilterBase<T>>('filterBy'), ()): '');

// // const isFilterEquality = (data: unknown[] | FilterEquality<unknown[]>): data is FilterEquality<unknown[]> => !isData(data) &&
// // (data).data !== 'undefined'
// // && (data as FilterEquality<unknown>).equalityData !== 'undefined'
// // && (data as FilterEquality<unknown>).equalityFilter !== 'undefined'
// // && (data as FilterEquality<unknown>).filterBy !== 'undefined';

// //  TODO
// //  Refactor - nested ternary operators
// const creteFilterStructure2 =
//   <T extends unknown[]>(data: T | FilterEquality<T>) =>
//   (
//     filter?: FilterBase<T>
//   ): {
//     filter: {
//       filterBy:
//         | FilterReferenceValues<ReferenceValues & InferEntity<T>>
//         | FilterPrimitiveValues<PrimitiveValues & InferEntity<T>>
//         | Record<string, unknown>;
//     };
//     shouldHighlight: boolean;
//   } => ({
//     filter: {
//       filterBy:
//         (!isData(data) && data.filterBy) ?? (filter && filter.filterBy) ?? {},
//     },
//     shouldHighlight:
//       (!isData(data) && data.shouldHighlight) ??
//       (filter && filter.shouldHighlight) ??
//       false,
//   });

// const creteFilterStructure3 =
//   <T extends unknown[]>(data: T | FilterEquality<T>) =>
//   (filter?: FilterBase<T>) => ({
//     filter: {
//       filterBy: pipe(
//         O.fromNullable(filter),
//         O.chain(RE.lookup("filterBy")),
//         O.altW(() => (!isData(data) ? RE.lookup("filterBy", data) : O.none))
//         // ()
//         // O.altW(() => (!isData(data) ? O.some(data.filterBy) : O.none)),
//         // O.foldW(() => ({} as Record<string, unknown>), identity)
//       ),
//     },
//     shouldHighlight:
//       (!isData(data) && data.shouldHighlight) ??
//       (filter && filter.shouldHighlight) ??
//       false,
//   });

// const getValueFromNullableFilter =
//   <T extends unknown[]>(key: keyof FilterBase<T>) =>
//   (filter?: FilterBase<T>) =>
//     pipe(
//       filter,
//       O.fromNullable,
//       O.chainNullableK((filter) => filter[key])
//     );

// const getValueFromData =
//   <T extends unknown[]>(key: keyof FilterEquality<T>) =>
//   (data: T | FilterEquality<T>) =>
//     pipe(
//       data,
//       O.fromNullable,
//       O.chainNullableK((filter) => (!isData(filter) ? filter[key] : O.none))
//     );

// //  TODO
// //  Check type of filterBy whether is array of object
// const creteFilterStructure5 =
//   <T extends unknown[]>(data: T | FilterEquality<T>) =>
//   (filter?: FilterBase<T>) => ({
//     filterBy: pipe(
//       filter,
//       getValueFromNullableFilter("filterBy"),
//       O.altW(() => pipe(data, getValueFromData("filterBy"))),
//       O.fold(() => ({}), identity)
//     ),
//     shouldHighlight: pipe(
//       filter,
//       getValueFromNullableFilter("shouldHighlight"),
//       O.altW(() => pipe(data, getValueFromData("shouldHighlight"))),
//       O.fold(() => false, identity)
//     ),
//   });

// const creteFilterStructure4 =
//   <T extends unknown[]>(data: T | FilterEquality<T>) =>
//   (filter?: FilterBase<T>) => ({
//     filterBy: pipe(
//       O.fromNullable(filter),
//       O.chainNullableK((filter) => filter.filterBy),
//       O.altW(() => (!isData(data) ? O.some(data.filterBy) : O.none)),
//       O.fold(() => ({}), identity)
//     ),
//     shouldHighlight: pipe(
//       O.fromNullable(filter),
//       O.chainNullableK((filter) => filter.shouldHighlight),
//       O.alt(() =>
//         !isData(data) ? O.fromNullable(data.shouldHighlight) : O.none
//       ),
//       O.fold(() => false, identity)
//     ),
//   });

// const createFilterFromParameters2 = <T extends unknown[]>(
//   data: T | FilterEquality<T>,
//   filter?: FilterBase<T>
// ) =>
//   pipe(
//     filter,
//     creteFilterStructure2(data),
//     (filterStructure) => filterStructure.filter.filterBy
//   );

// const filter1 = useFilter([1, 2, 3], {
//   filterBy: [1, 2],
//   shouldHighlight: true,
// });

// const filter2 = useFilter(invoices, {
//   filterBy: { name: ["john"] },
//   shouldHighlight: false,
// });

// const filter = {
//   1: [1],
//   2: [2],
// };

// const filter3 = useFilter({
//   data: invoices,
//   filterBy: {
//     name: ["john", "doe"],
//   },
//   equalityData: { equals: (x, y) => x.length === y.length },
//   equalityFilter: { equals: (x, y) => x.amount?.length === y.amount?.length },
// });

// const filter4 = useFilter({
//   data: [1, 2],
//   filterBy: [1, 2],
//   equalityData: { equals: (x, y) => x.length === y.length },
//   equalityFilter: { equals: (x, y) => x.length === y.length },
// });

// export function useFilter<T extends unknown[]>(
//   data: FilterEquality<T>
// ): { data: T; filter: FilterBase<T> };
// export function useFilter<T extends unknown[]>(
//   data: T,
//   filter: FilterBase<T>
// ): { data: T; filter: FilterBase<T> };
// export function useFilter<T extends unknown[]>(
//   data: T | FilterEquality<T>,
//   filter?: FilterBase<T>
// ): {
//   data: T;
//   filter: FilterBase<T>;
// } {
//   if (isData(data)) {
//     const p = isElemPrimitiveType(data) ? pipe(data, () => 1) : 1;
//   }
//   // const filterReducer: Reducer<FilterState<Data, Rec>, FilterActions<Rec>> = (state, action) => {
//   //   return {}
//   // };

//   // const {} = useReducer();

//   return {
//     data,
//     filter: filter ? filter : { filterBy: {}, shouldHighlight: true },
//   };
// }

// // export const useFilter = <A extends PrimitiveValues | ReferenceValues, FP extends FilterParams<A>>(
// //   filterParams: FP
// // ) => {

// //   // const arrayEq  = ('eq' in filterParams) ? filterParams.eq : { equals: (x, y) => x === y} ;

// //   const [data, setData] = useStateStable<FilterState<A>>({
// //     state: initState,
// //     filteredState: initState,
// //   }, ());

// //   const _setDataIO = useCallback(
// //     (filteredState: Array<A>) =>
// //       pipe(
// //         filteredState,
// //         IO.of,
// //         IO.chainFirst((filteredState) =>
// //           setData((prevState) => ({ ...prevState, filteredState }))
// //         )
// //       ),
// //     [setData]
// //   );

// //   //  filter elems
// //   const filter = useCallback(
// //     (predicate: Predicate<A>) =>
// //       pipe(data.state, A.filter(predicate), _setDataIO),
// //     [data, _setDataIO]
// //   );

// //   //  contains elem
// //   const elem = (valB: A) =>
// //     pipe(
// //       data.state,
// //       A.some((valA) => eq.equals(valA, valB))
// //     );

// //   const { filteredState: items } = data;
// //   return {
// //     items,
// //     filter,
// //     elem,
// //   };
// // };

// // interface FilterParams<A> {
// //   initState?: A[];
// //   ord?: ORD.Ord<A>;
// //   eq?: EQ.Eq<A>;
// // }

// // interface FilterState<A> {
// //   filteredState: A[];
// //   state: A[];
// // }

// // export const useFilter = <A>({
// //   initState = [],
// //   eq = { equals: (x, y) => x === y },
// //   ord = { equals: eq.equals, compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0) },
// // }: FilterParams<A>) => {
// //   const [data, setData] = useStateStaleIO<FilterState<A>>({
// //     state: initState,
// //     filteredState: initState,
// //   });

// //   const _setDataIO = useCallback(
// //     (filteredState: Array<A>) =>
// //       pipe(
// //         filteredState,
// //         IO.of,
// //         IO.chainFirst((filteredState) =>
// //           setData((prevState) => ({ ...prevState, filteredState }))
// //         )
// //       ),
// //     [setData]
// //   );

// //   //  filter elems
// //   const filter = useCallback(
// //     (predicate: Predicate<A>) =>
// //       pipe(data.state, A.filter(predicate), _setDataIO),
// //     [data, _setDataIO]
// //   );

// //   //  contains elem
// //   const elem = (valB: A) =>
// //     pipe(
// //       data.state,
// //       A.some((valA) => eq.equals(valA, valB))
// //     );

// //   const { filteredState } = data;
// //   return {
// //     items: filteredState,
// //     filter,
// //     elem,
// //   };
// // };
