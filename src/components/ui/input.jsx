import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

const NumberInput = ({ className, value, onChange, ...props }) => {
  const handleIncrement = () => {
    onChange({ target: { value: value + 1 } });
  };

  const handleDecrement = () => {
    onChange({ target: { value: Math.max(1, value - 1) } });
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        min={1}
        value={value}
        onChange={onChange}
        readOnly
        className={className}
        {...props}
      />
      <div className="flex space-x-1">
        <Button onClick={handleDecrement} size="sm"  className="w-10 h-10">
          -
        </Button>
        <Button onClick={handleIncrement} size="sm"  className="w-10 h-10">
          +
        </Button>
      </div>
    </div>
  );
};

export { Input, NumberInput };