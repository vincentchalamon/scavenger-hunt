"use client";

import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {ItemFactory} from "@/components/Items/ItemFactory";
import {Item} from "@/types/Item";

interface ItemsListProps {
  items: Item[];
}

export const ItemsList: React.FC<ItemsListProps> = ({items}) => {
  return (
    <Container className="py-2" fluid>
      <Row className="g-2">
        {items.map(item => (
          <Col className="col-4" key={item.name}>
            {ItemFactory.create(item).icon()}
          </Col>
        ))}
      </Row>
    </Container>
  )
}
