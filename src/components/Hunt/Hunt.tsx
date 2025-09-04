"use client";

import {Button, Container, Nav, Navbar, Row, Tab} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import {Map} from "@/components/Map/Map";
import {ItemsList as ItemsList} from "@/components/ItemsList/ItemsList";
import React, {useEffect, useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";
import {ClipLoader} from "react-spinners";

interface HuntProps {
  hunt: HuntType;
}

export const Hunt: React.FC<HuntProps> = ({hunt}) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [opacity, setOpacity] = useState<number>(1);

  if (typeof window !== "undefined") {
    useEffect(() => {
      // Total height - bottom navbar - top navbar
      const timeout = setTimeout(() => {setHeight(window.innerHeight - 40 - 59)}, 500);

      return () => clearTimeout(timeout);
    }, [window]);

    useEffect(() => {
      if (opacity === 0 || typeof height === "undefined") {
        return;
      }

      const interval = setInterval(() => {
        setOpacity(opacity - 0.1);
      }, 20);

      return () => {
        clearInterval(interval);
      };
    }, [height, opacity]);
  }

  return (
    <>
      {opacity > 0 && (
        <Container
          className="z-3 vh-100 vw-100 mw-100 position-fixed top-0 left-0 bg-dark align-content-center text-center"
          style={{opacity: opacity}}>
          <ClipLoader size={80} color="white"/>
        </Container>
      )}
      <Navbar fixed="top" className="z-0 bg-light border-bottom border-dark">
        <Container>
          <Navbar.Brand>
            <Button type="button" size="lg" className="py-0 me-2 bg-transparent border-0 text-dark fs-1 lh-1" href="/">&#8249;</Button>
            {hunt.name}
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="px-0 d-flex bg-danger" style={{
        paddingTop: '58px',
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Tab.Container defaultActiveKey="manuscript">
          <Tab.Content className="bg-success" style={{height: `${height}px`}}>
            <Tab.Pane eventKey="manuscript" className="h-100">
              <Manuscript manuscript={hunt.manuscript}/>
            </Tab.Pane>
            <Tab.Pane eventKey="items" className="h-100">
              <ItemsList items={hunt.items}/>
            </Tab.Pane>
            <Tab.Pane eventKey="map" className="h-100">
              <Map/>
            </Tab.Pane>
          </Tab.Content>
          <Nav variant="pills" justify fill className="bg-white text-dark border-top border-dark">
            <Container>
              <Row>
                <Nav.Item>
                  <Nav.Link eventKey="manuscript">
                    <i className="bi bi-house"></i>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="items">
                    <i className="bi bi-backpack3"></i>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="map">
                    <i className="bi bi-compass"></i>
                  </Nav.Link>
                </Nav.Item>
              </Row>
            </Container>
          </Nav>
        </Tab.Container>
      </div>
    </>
  )
}
