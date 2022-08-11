import React from "react";
/**
 * Redeclare forwardRef to use generic props in forwardRef
 */

declare module "react" {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (prop: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (prop: P & React.RefAttributes<T>) => React.ReactElement | null;

  type ElementProps<T> = T extends React.ComponentType<infer P>
    ? P extends Record<string, unknown>
      ? P
      : never
    : never;
}
