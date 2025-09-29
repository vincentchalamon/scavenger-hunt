"use client";

import React from "react";
import {Button} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";

export type KeywordProps = {
  debug?: boolean;
  keyword: string;
};

export const Keyword: React.FC<KeywordProps> = ({keyword, debug}) => {
  const {addKeyword} = useKeyword();

  return (
    // @ts-ignore
    <Button className="h-100 w-100 opacity-50" variant={debug ? "primary" : "link"} onClick={() => addKeyword(keyword)}/>
  );
}
