import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useCallback, useState} from "react";

export type ToyProps = {
  x: number;
}

function Child({ x }: ToyProps) {
  const [xVal, setXval] = useState<number>(0);

  const handleChange = useCallback(() => {
    alert('DropdownButton button item clicked');
  }, [setXval]);
  
  return (
    <div>
      Hi
      <input value={xVal} onChange={handleChange}></input>
    </div>
  );
}

function Parent() {
  const [values, setValues] = useState<string[]>([]);

  const handleChange = useCallback(() => {
    alert('DropdownButton button item clicked');
  }, [setXval]);
  
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      alert(`DropdownButton button item clicked with value: ${Object.keys(event.target)}`);
    }
    
  }, [])
  
  return (
    <div>
      Hi
      <input value={xVal} onChange={handleChange}></input>
    </div>
  );
}

export default Parent;


// return (
//   <DropdownButton id="dropdown-basic-button" title="Basic Button">
//     <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
//     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
//     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
//   </DropdownButton>
// );
