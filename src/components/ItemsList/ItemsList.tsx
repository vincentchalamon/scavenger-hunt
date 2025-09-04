"use client";

import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import React, {useState} from "react";
import {ItemFactory} from "@/components/Items/ItemFactory";
import {Item} from "@/types/Item";

interface ItemsListProps {
  items: Item[];
}

export const ItemsList: React.FC<ItemsListProps> = ({items}) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);

  return (
    <Container className="py-2" fluid>
      <Row className="g-2">
        {items.map(item => {
          const itemComponent = ItemFactory.create(item);

          return (
            <Col className="col-4" key={item.name}>
              {itemComponent.icon(() => setSelectedItem(item.name))}
              <Modal show={selectedItem === item.name} fullscreen onHide={() => setSelectedItem(undefined)}>
                <Modal.Body className="p-0 position-relative">
                  <Button className="btn-close z-3 position-absolute m-3 top-0 end-0" onClick={()=> setSelectedItem(undefined)}/>
                  {itemComponent.render()}
                </Modal.Body>
              </Modal>
            </Col>
          );
        })}
      </Row>
    </Container>
  )
}
