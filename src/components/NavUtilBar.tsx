import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, {useContext, useRef, useState} from "react";
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
  addEmptyObjectNode: () => void,
  addEmptyProcessNode: () => void
}

const variant = "Primary";

function NavUtilBar({ brand, addEmptyObjectNode, addEmptyProcessNode }: NavUtilBarProps) {
  const [currentItems, setCurrentItems] = useState<NavItem[]>([]);
  const [renderMetadata, setRenderMetadata] = useState<boolean>(false);
  
  const setterButtonConfig: SetterButtonConfig[] = [
    {
      title: "Add new object",
      onClick: addEmptyObjectNode,
      style: {
        position: "absolute",
        top: 20,
        //right: 10,
        left: 700,
        padding: "10.5px 16px",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }
    },
    {
      title: "Add new process",
      onClick: addEmptyProcessNode,
      style: {
        position: "absolute",
        top: 20,
        //right: 10,
        left: 475,
        padding: "10.5px 16px",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }
    }
  ];
  
  return (
    <Navbar variant="dark" bg="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand href="#home">{ brand }</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav>
            <GetTypes />
            
            <NavDropdown.Divider />
            
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
  );
}

export default NavUtilBar;
