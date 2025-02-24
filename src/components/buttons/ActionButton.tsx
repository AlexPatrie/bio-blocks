import React, {useCallback, useState} from "react";
import Button from "react-bootstrap/Button";
import {Data} from "../datamodel/flow";
import {StyleConfig} from "../datamodel/elements";


export type ActionButtonProps = {
  variant: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark" | "link";
  title: string | React.JSX.Element;
  onClick?: (data?: Data) => void;
  data?: any;
  style?: StyleConfig;
};

export default function ActionButton({ variant, title, onClick, data, style }: ActionButtonProps) {
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
      >{ title }
      </Button>
    </>
  );
}
