import UploadSpec from "./UploadSpec";
import React from "react";
import ActionButton from "./ActionButton";


type UploadButtonsProps = {
  importComposition: (e: React.ChangeEvent<HTMLInputElement>) => void;
  exportComposition: () => void;
}

export default function UploadButtons({ importComposition, exportComposition }: UploadButtonsProps) {
  return (
    <div style={{display: "flex", justifyContent: "space-between", paddingLeft: "55rem"}}>
      <UploadSpec onLoadGraph={importComposition}/>
      <div style={{width: '1rem'}}></div>
      <ActionButton
        title="Export"
        variant="success"
        onClick={exportComposition}
      >
      </ActionButton>
    </div>
  )
}
