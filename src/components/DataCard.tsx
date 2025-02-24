import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {ButtonConfig, ImageConfig, StyleConfig} from "./datamodel/elements";
import React from "react";


export type DataCardProps = {
  title: string;
  style?: StyleConfig;
  image?: ImageConfig;
  button?: ButtonConfig;
  data?: any | React.JSX.Element[]
}

function DataCard({ title, style, image, button, data }: DataCardProps) {
  // const src = "holder.js/100px180"
  return (
    <div style={ !style ? {} : style }>
      <Card>
        {image && (
          <Card.Img variant={image.variant} src={image.src} />
        )}
        <Card.Body>
          <Card.Title>{ title }</Card.Title>
          {data && (
            <Card.Text>
            { data }
          </Card.Text>
          )}
          {button && (
            <Button variant="primary">Go somewhere</Button>
          )}
        </Card.Body>
      </Card>
    </div>
    
  );
}

export default DataCard;
