"use client";

import {Container, ListGroup, ListGroupItem} from "react-bootstrap";
import React from "react";
import {Hunt} from "@/types/Hunt";

type HuntsListProps = {
  hunts: Hunt[];
}

const HuntsList: React.FC<HuntsListProps> = ({hunts}) => (
  <Container className="py-3">
    <ListGroup>
      {hunts.map(hunt => (
        <ListGroupItem key={hunt.slug} action={true} href={hunt.url}>
          {hunt.name} - {hunt.lang}
        </ListGroupItem>
      ))}
    </ListGroup>
  </Container>
)

export default HuntsList;
