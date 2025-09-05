"use client";

import {Container} from "react-bootstrap";
import {FunctionComponent} from "react";

export const Manuscript: FunctionComponent<{ manuscript: string }> = ({manuscript}) => (
  <Container className="py-3 text-dark">{manuscript}</Container>
)
