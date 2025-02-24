import React, {useCallback, useState} from "react";
import ComposeService from "../../services/ComposeService";
import {BigraphSchemaType, RegisteredAddresses} from "../datamodel/requests";
import DropdownButton from "react-bootstrap/DropdownButton";
import {DropdownItem} from "react-bootstrap";
import {Variant} from "../datamodel/elements";


type GetTypesProps = {
  composeService?: ComposeService;
  variant?: Variant;
};

export default function GetAddresses({ composeService, variant }: GetTypesProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<RegisteredAddresses>();
  const [version, setVersion] = useState<string>("");
  const service = new ComposeService();
  
  const getAddressesData = async () => {
    await service.getBigraphSchemaAddresses()
      .then((addressesData: RegisteredAddresses) => {
        setAddresses((prevAddresses: RegisteredAddresses | undefined) => {
          if (prevAddresses) {
            return {
              ...prevAddresses,
              ...addressesData,
            }
          } else {
            return addressesData;
          }
        });
        
        setVersion((prevVersion: string) => {
          return addressesData.version;
        });
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
    (event: React.MouseEvent<HTMLButtonElement>, address: string) => {
      handleCopy(event, JSON.stringify(address));
      alert(`Item copied to clipboard`);
  }, [handleCopy]);
  
  const v = variant ? variant : "outline-info";
  
  return (
    <div className="p-4">
      <DropdownButton
        onClick={getAddressesData}
        title="Get Process Addresses"
        key={variant}
        id={`dropdown-variants-${variant}`}
        variant={v.toLowerCase()}
      >
        {addresses && (
          <DropdownItem>
            <span style={{ fontWeight: "700" }}>Version: { version }</span>
          </DropdownItem>
        )}
        {addresses && addresses.registered_addresses.map ((address, index: number) => (
          <div>
            <DropdownItem
              onClick={((e: React.MouseEvent<HTMLButtonElement>) => handleClick(e, address))}
            >
              {address}
            </DropdownItem>
          </div>
          )
          
        )}
      </DropdownButton>
    </div>
    
  )
}
