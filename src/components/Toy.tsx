import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import React, {useCallback, useState} from "react";

export type ToyProps = {
  x: number;
}

const SimpleParent = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return <SimpleChild increment={increment} />;
};

const SimpleChild = ({ increment }: { increment: () => void }) => (
  <button onClick={increment}>Increment</button>
);


function Child({ x }: ToyProps) {
  const [xVal, setXval] = useState<number>(0);

  const handleChange = useCallback(() => {
    console.log('DropdownButton button item clicked');
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
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  
  }, [setValues]);
  
  
  
  return (
    <div>
      Hi
      {values.map((value, index) => (
        <input value={value} onChange={handleChange}></input>
      ))}
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
