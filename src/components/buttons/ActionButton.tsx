import React, {useCallback, useState} from "react";
import Button from "react-bootstrap/Button";
import {Data} from "../datamodel/flow";
import {StyleConfig, Variant} from "../datamodel/elements";


export type ActionButtonProps = {
  variant: string | Variant;
  title: string | React.JSX.Element;
  className?: string;
  onClick?: (data?: Data) => void;
  data?: any;
  style?: StyleConfig;
};

export default function ActionButton({ variant, title, onClick, data, style, className }: ActionButtonProps) {
  const handleClick = useCallback(() => {
    console.log('Button clicked');
    if (onClick) {
      onClick(data);
    }
  }, [data]);
  
  return (
    <>
      <Button
        key={variant}
        variant={variant}
        onClick={handleClick}
        style={style ? style : {}}
        className={className ? className : "p-1"}
      >{ title }
      </Button>
    </>
  );
}
