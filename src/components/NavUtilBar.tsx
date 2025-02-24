import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, {useContext, useRef, useState} from "react";
import GetTypes from "./buttons/GetTypes";
import DropdownButton from "react-bootstrap/DropdownButton";
import GetAddresses from "./buttons/GetAddresses";
import ActionButton from "./buttons/ActionButton";
import {Data} from "./datamodel/flow";
import {StyleConfig} from "./datamodel/elements";

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

// export type ActionButtonProps = {
//   variant: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark" | "link";
//   title: string;
//   onClick: (data?: Data) => void | null;
//   data: any | null;
//   style: StyleConfig | null;
// };

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
            <GetAddresses />
            <NavDropdown.Divider />
            
            <div className="action-buttons-container">
              {setterButtonConfig.map((item, index) => (
                <div className="action-button">
                  <ActionButton variant="secondary" title={item.title} />
                </div>
              ))}
            </div>
            
            
            
            {/*{setterButtonConfig.map((item, index) => (
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
            ))}*/}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavUtilBar;
