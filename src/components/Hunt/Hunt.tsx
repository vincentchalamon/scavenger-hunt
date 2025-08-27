"use client";

import {Button, Container, Navbar} from "react-bootstrap";
import {Manuscript} from "@/components/Manuscript/Manuscript";
import {Map} from "@/components/Map/Map";
import {ItemsList as ItemsList} from "@/components/ItemsList/ItemsList";
import React, {useState} from "react";
import {Hunt as HuntType} from "@/types/Hunt";

interface HuntProps {
  hunt: HuntType;
}

export const Hunt: React.FC<HuntProps> = ({hunt}) => {
  const [tab, setTab] = useState('manuscript');

  return (
    <>
      <Navbar fixed="top" className="bg-light">
        <Container>
          <Navbar.Brand>{hunt.name}</Navbar.Brand>
          <Navbar.Text><Button type="button" className="btn-close" href="/"/></Navbar.Text>
        </Container>
      </Navbar>
      <Container className="my-5 py-1 px-0">
        {tab === 'manuscript' && <Manuscript manuscript={hunt.manuscript}/>}
        {tab === 'items' && <ItemsList items={hunt.items}/>}
        {tab === 'map' && <Map/>}
      </Container>
      <Navbar fixed="bottom" className="bg-light text-dark">
        <Container>
          <Button active={tab === 'manuscript'} onClick={() => setTab('manuscript')} size="lg">
            <i className="bi bi-house"></i>
          </Button>
          <Button active={tab === 'items'} onClick={() => setTab('items')} size="lg">
            <i className="bi bi-backpack3"></i>
          </Button>
          <Button active={tab === 'map'} onClick={() => setTab('map')} size="lg">
            <i className="bi bi-compass"></i>
          </Button>
        </Container>
      </Navbar>
    </>
  )
}
