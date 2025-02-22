import Dropdown from 'react-bootstrap/Dropdown';
import {useState} from "react";

export type GenericDataDropdownProps = {
  title: string;
  data: Record<string, any>;
}

function DataDropdown({ title, data }: GenericDataDropdownProps) {
  const [currentData, setCurrentData] = useState<Record<string, any>>(data);
  
  return (
    <Dropdown title={title}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
      
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.keys(currentData).map((key: string, index: number) => (
          <Dropdown.Item href={`#/action-${index}`}>
            <pre className="mt-4 p-4 border">
              {JSON.stringify(currentData[key], null, 2)}
            </pre>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DataDropdown;
