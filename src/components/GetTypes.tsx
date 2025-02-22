import React, {useCallback, useState} from "react";
import ComposeService from "../services/ComposeService";
import {BigraphSchemaType} from "./datamodel/requests";
import DropdownButton from "react-bootstrap/DropdownButton";
import {DropdownItem} from "react-bootstrap";


type GetTypesProps = {
  composeService?: ComposeService;
}

export const CopyToClipboardButton: React.FC = () => {
  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    const textToCopy = (event.target as HTMLButtonElement).textContent || "";
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log("Copied to clipboard:", textToCopy))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <button onClick={handleCopy}>Copy this text</button>
  );
};

export default function GetTypes({ composeService }: GetTypesProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [types, setTypes] = useState<BigraphSchemaType[]>([]);
  const service: ComposeService = !composeService ? new ComposeService() : composeService;
  
  const setTypesData = useCallback((typesData: BigraphSchemaType[]) => {
    setTypes((existingTypes: BigraphSchemaType[]) => {
      if (typesData !== existingTypes) {
        return typesData;
      } else {
        return existingTypes;
      }
    })
  }, [setTypes]);
  
  const getTypesData = async () => {
    await service.getBigraphSchemaTypes()
      .then((typesData: BigraphSchemaType[]) => {
        setTypesData(typesData);
      })
      .catch((error: Error) => {
        alert(`Error while processing your data: ${ error }`);
      })
  };
  
  const handleExpanded = useCallback(() => {
    setExpanded((currentlyExpanded: boolean) => {
      console.log(`Changing types data isExpanded from ${currentlyExpanded} to ${!currentlyExpanded}`);
      return !currentlyExpanded;
    });
  }, [setExpanded]);
  
  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>, text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => console.log("Copied:", text))
      .catch((err) => console.error("Copy failed:", err));
  };
  
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, schemaType: BigraphSchemaType) => {
      handleCopy(event, JSON.stringify(schemaType));
      alert(`Item copied to clipboard`);
  }, [handleCopy]);
  
  const variant = "Primary"
  
  return (
    <div className="p-4">
      <DropdownButton
        onClick={getTypesData}
        title="Get Types"
        key={variant}
        id={`dropdown-variants-${variant}`}
        variant={variant.toLowerCase()}
      >
        {types.map((schemaType: BigraphSchemaType, index) => (
          <DropdownItem onClick={((e: React.MouseEvent<HTMLButtonElement>) => handleClick(e, schemaType))} className="types-grid-item">
            {schemaType["type_id"]}: {JSON.stringify(schemaType['default_value'])}
          </DropdownItem>
        ))}
      </DropdownButton>
    </div>
    
  )
}
