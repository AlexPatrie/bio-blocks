import UploadSpec from "./UploadSpec";
import React from "react";
import ActionButton from "./ActionButton";
import { VscOutput } from "react-icons/vsc";


type UploadButtonsProps = {
  importComposition: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportComposition: () => void;
}

export default function UploadButtons({ importComposition, exportComposition }: UploadButtonsProps) {
  
  const d = () => {
    return <div></div>
  }
  return (
    <div style={{display: "flex", justifyContent: "space-between", paddingLeft: "55rem"}}>
      <UploadSpec onLoadGraph={importComposition}/>
      <div style={{width: '1rem'}}></div>
      <ActionButton
        title={(
          <div>
            <VscOutput/>
            <span style={{paddingLeft: "1rem"}}>Export to JSON</span>
          </div>
        )}
        variant="outline-success"
        onClick={exportComposition}
      >
      </ActionButton>
    </div>
  )
}
