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
import UploadSpec from "./buttons/UploadSpec";
import UploadButtons from "./buttons/UploadButtons";

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
  handleProjectNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  importComposition: (event: React.ChangeEvent<HTMLInputElement>) => void,
  exportComposition: () => void;
}

// export type ActionButtonProps = {
//   variant: "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark" | "link";
//   title: string;
//   onClick: (data?: Data) => void | null;
//   data: any | null;
//   style: StyleConfig | null;
// };

const variant = "Primary";

function NavUtilBar(
  { brand, addEmptyObjectNode, addEmptyProcessNode, handleProjectNameChange, importComposition, exportComposition }: NavUtilBarProps
) {
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
        <Navbar.Brand href="#home">{ <div className="project-name">
        <input
          id="inputField"
          type="text"
          value={brand}
          onChange={handleProjectNameChange}
          placeholder="Enter project name..."
        />
      </div> }</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav>
            
            <NavDropdown.Divider />
            <div className="action-buttons-container">
              <GetTypes />
              <GetAddresses />
              {setterButtonConfig.map((item, index) => (
                <div className="action-button">
                  <ActionButton variant="secondary" title={item.title} />
                </div>
              ))}
              <UploadButtons importComposition={importComposition} exportComposition={exportComposition} />
            </div>
            
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavUtilBar;
