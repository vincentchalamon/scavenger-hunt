"use client";

import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {ItemFactory} from "@/components/Items/ItemFactory";
import {Item} from "@/types/Item";
import {ModalItem} from "@/components/Items";

interface ItemsListProps {
  items: Item[];
}

export const ItemsList: React.FC<ItemsListProps> = ({items}) => (
  <Container className="py-2" fluid>
    <Row className="g-2">
      {items.map((item, i) => {
        const itemComponent = ItemFactory.create(item);

        return (
          <Col className="col-4" key={i}>
            <ModalItem button={itemComponent.renderButton()} onHide={itemComponent.onHide} onShow={itemComponent.onShow}>
              {itemComponent.render()}
            </ModalItem>
          </Col>
        );
      })}
    </Row>
  </Container>
)
