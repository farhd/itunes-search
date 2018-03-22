import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

const ResultCard = (props) => {
    return (
        <Card>
            <CardImg src={props.imgsrc} alt="Artwork" />
            <CardBody>
                <CardTitle>{props.title}</CardTitle>
                <CardSubtitle>{props.subtitle}</CardSubtitle>
                <CardText>{props.desc ? props.desc.slice(0,100).concat('...'): ''}</CardText>
                <Button>{props.preview}</Button>
            </CardBody>
        </Card>
    );
};

export default ResultCard;