import React, {useCallback} from "react";
import { VscCopy } from "react-icons/vsc";
import ActionButton from "./ActionButton";

export type CopyButtonProps = {
  text: string;
};
  
export default function CopyButton({ text }: CopyButtonProps) {
  const [currentText, setCurrentText] = React.useState<string>(text);
  
  const copyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
        .then(() => console.log("Copied to clipboard:", textToCopy))
        .catch((err) => console.error("Failed to copy:", err));
  };
  
  const onClick = useCallback(
    (currentEvent: React.MouseEvent<SVGElement>) => {
      copyText(currentText);
  }, [copyText, currentText]);
  
  const copyButton = () => {
    return (
      <VscCopy onClick={((e: React.MouseEvent<SVGElement>) => onClick(e))}/>
    )
  };

  return (
    <ActionButton variant="secondary" title={ copyButton() }></ActionButton>
  );
};
