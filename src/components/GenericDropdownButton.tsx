import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useCallback, useState} from "react";

type DropdownItem = {
  href: string;
  text: string;
};

export type DropdownButtonProps = {
  title: string;
  items: DropdownItem[];
}

function GenericDropdownButton({ title, items }: DropdownButtonProps) {
  const [buttonTitle, setButtonTitle] = useState<string>(title);
  const [buttonItems, setButtonItems] = useState<DropdownItem[]>(items);
  // TODO: add name changer
  const onClick = useCallback(() => {
    alert('DropdownButton button item clicked');
  }, []);
  
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      alert(`DropdownButton button item clicked with value: ${Object.keys(event.target)}`);
    }
    
  }, [])
  
  return (
    <DropdownButton id="dropdown-basic-button" title={title}>
      {items.map((item) => (
        <Dropdown.Item onClick={onClick} href={item.href}>
          <input value={item.text} onKeyDown={onKeyDown}></input>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

export default GenericDropdownButton;


// return (
//   <DropdownButton id="dropdown-basic-button" title="Basic Button">
//     <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
//     <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
//     <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
//   </DropdownButton>
// );
