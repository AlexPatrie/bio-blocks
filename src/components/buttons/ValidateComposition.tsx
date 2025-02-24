import React, {useCallback, useState} from "react";
import ComposeService from "../../services/ComposeService";
import {BigraphSchemaType, ValidatedComposition} from "../datamodel/requests";
import DropdownButton from "react-bootstrap/DropdownButton";
import {DropdownItem} from "react-bootstrap";


type ValidateCompositionProps = {
  composeService?: ComposeService;
}

export default function ValidateComposition({ composeService }: ValidateCompositionProps) {
  const [validation, setValidation] = useState<ValidatedComposition>({valid: true, invalid_nodes: null});
  const service: ComposeService = !composeService ? new ComposeService() : composeService;
  
  const setValidationData = useCallback((validationData: ValidatedComposition) => {
    setValidation((data: ValidatedComposition) => {
      return {
        ...data,
        ...validationData,
      }
    })
  }, [setValidation]);
  
  const getValidationData = async (specFile: File | null) => {
    await service.validateComposition(specFile)
      .then((validationData: ValidatedComposition | null) => {
        if (validationData) {
          setValidationData(validationData);
        }
      })
      .catch((error: Error) => {
        alert(`Error while processing your data: ${ error }`);
      })
  };
  
  const variant = "Primary"
  
  return (
    <div className="p-4">
      <DropdownButton
        // onClick={getValidationData}
        title="Get Types"
        key={variant}
        id={`dropdown-variants-${variant}`}
        variant={variant.toLowerCase()}
      >
        {validation && (
          <DropdownItem>
            { JSON.stringify(validation, null, 2) }
          </DropdownItem>
        )}
      </DropdownButton>
    </div>
    
  )
}
