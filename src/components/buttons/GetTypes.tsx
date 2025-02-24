import React, {useCallback, useEffect, useState} from "react";
import ComposeService from "../../services/ComposeService";
import {BigraphSchemaType} from "../datamodel/requests";
import DropdownButton from "react-bootstrap/DropdownButton";
import {DropdownItem} from "react-bootstrap";
import CopyButton from "./CopyButton";
import {VscCopy} from "react-icons/vsc";
import ActionButton from "./ActionButton";
import useTimeout from "@restart/hooks/useTimeout";
import {Variant} from "../datamodel/elements";


type GetTypesProps = {
  composeService?: ComposeService;
  variant?: Variant;
}

export default function GetTypes({ composeService, variant }: GetTypesProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [types, setTypes] = useState<BigraphSchemaType[]>([]);
  const [isHovered, setHovered] = useState(false);
  const service: ComposeService = !composeService ? new ComposeService() : composeService;
  
  useEffect(() => {
    setTypes((types: BigraphSchemaType[]) => {
      console.log(`Current types data: ${types.length}`);
      return types;
    })
  }, [types, setTypes])
  
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
    /* only triggers the first time, then caches the data */
    if (types.length < 1) {
      await service.getBigraphSchemaTypes()
        .then((typesData: BigraphSchemaType[]) => {
          setTypesData(typesData);
        })
        .catch((error: Error) => {
          alert(`Error while processing your data: ${ error }`);
        })
    }
  };
  
  const v = variant ? variant : "outline-info"
  
  return (
    <div className="p-4">
      <DropdownButton
        onClick={getTypesData}
        title="Get Types"
        key={variant}
        id={`dropdown-variants-${variant}`}
        variant={v.toLowerCase()}
      >
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Type</th>
                <th className="border p-2">Default Value</th>
              </tr>
            </thead>
            <tbody>
              {types.map((schemaType: BigraphSchemaType, index) => (
                <tr key={index} style={{height: "3rem"}}>
                  <td className="border p-2">
                    {schemaType["type_id"]}
                  </td>
                  <td className="border p-2">
                    {JSON.stringify(schemaType['default_value'])}
                  </td>
                  
                  <CopyButton text={schemaType["type_id"]} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DropdownButton>
    </div>
    
  )
}
