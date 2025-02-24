"use client";

import React from "react";
// import { cn } from "@/lib/utils";
import {BaseHandle} from "./BaseHandle";
import { HandleProps } from "@xyflow/react";



const flexDirections = {
  top: "flex-col",
  right: "flex-row-reverse justify-end",
  bottom: "flex-col-reverse justify-end",
  left: "flex-row",
};

const LabeledHandle = React.forwardRef<
  HTMLDivElement,
  HandleProps &
    React.HTMLAttributes<HTMLDivElement> & {
      title: string;
      handleClassName?: string;
      labelClassName?: string;
    }
>(
  (
    { className, labelClassName, handleClassName, title, position, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      title={title}
      className="labeled-handle"
    >
      <BaseHandle position={position} className={handleClassName} {...props} />
      <label className="handle-label">
        {title}
      </label>
    </div>
  ),
);

LabeledHandle.displayName = "LabeledHandle";

export { LabeledHandle };
