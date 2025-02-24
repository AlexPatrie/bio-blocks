import React from "react";
import {Handle, HandleProps, Position} from "@xyflow/react";
// import { cn } from "@/lib/utils";

export const BaseHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & HandleProps
>(({ className, ...props }, ref) => (
  <Handle type="source" position={Position.Left} ref={ref} className="handle-base" />
));
BaseHandle.displayName = "BaseHandle";
