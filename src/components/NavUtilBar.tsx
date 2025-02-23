import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, {useContext, useState} from "react";
import GetTypes from "./GetTypes";
import GetProcessMetadata from "./GetProcessMetadata";
import DropdownButton from "react-bootstrap/DropdownButton";
import {FromMetadataContext} from "../contexts/FromMetadataContext";
import {NewPortCallbackContext} from "../contexts/PortCallbackContext";
import {ProcessMetadata} from "./datamodel/requests";

export type NavItem = {
  title: string;
  data: any;
}

export type SetterButtonConfig = {
  onClick: () => void,
  style: {},
  title: string
}

export type NavUtilBarProps = {
  brand: string,
  setterButtonConfig: SetterButtonConfig[],
  // processFromMetadata: (processMetadata: ProcessMetadata | any) => void,
}

const variant = "Primary";

function NavUtilBar({ brand, setterButtonConfig }: NavUtilBarProps) {
  const [currentItems, setCurrentItems] = useState<NavItem[]>([]);
  const [renderMetadata, setRenderMetadata] = useState<boolean>(false);
  
  const processFromMetadata = useContext(FromMetadataContext);
  
  return (
    <FromMetadataContext.Provider value={processFromMetadata}>
    <Navbar variant="dark" bg="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand href="#home">{ brand }</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav>
            <GetTypes />
            <NavDropdown.Divider />
            <GetProcessMetadata processFromMetadata={processFromMetadata} />
            
            {setterButtonConfig.map((item, index) => (
              <DropdownButton
                show={false}
                onClick={item.onClick}
                title={item.title}
                key={variant}
                id={`dropdown-variants-${variant}`}
                variant={variant.toLowerCase()}
                style={item.style}
              >
                <div style={{ display: "none" }}></div>
              </DropdownButton>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </FromMetadataContext.Provider>
  );
}

export default NavUtilBar;
