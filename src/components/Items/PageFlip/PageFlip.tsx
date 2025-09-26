"use client";

import {Item, ItemFactory} from "@/components/Items";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import HTMLFlipBook from "react-pageflip";
import styles from "./pageFlip.module.css";
import {ItemOptionsType} from "@/types/Item";
import {Button, Image as Img} from "react-bootstrap";
import {PhraseContext} from "@/contexts/PhraseContext";
import {ToastContext} from "@/contexts/ToastContext";

type PageProps = {
  text: string;
}

type PageFlipProps = ItemOptionsType & {
  image: string;
  pages: PageProps[];
}

export class PageFlip extends Item {
  constructor(private options: PageFlipProps) {
    super();
  }

  renderImage(): ReactNode {
    return (
      <Img src={this.options.image} className="w-100 mh-100"/>
    );
  }

  render(): ReactNode {
    return (
      <Component pages={this.options.pages} debug={this.options.debug}/>
    );
  }
}

const Component: React.FC<Omit<PageFlipProps, "image">> = ({pages, debug}) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [width, setWidth] = useState<number | undefined>(undefined);

  if (typeof screen !== "undefined") {
    useEffect(() => {
      // Total height - bottom navbar - top navbar
      setHeight((screen.height - 40 - 59) / 2);
      setWidth((screen.width / 2) - 20);
    }, [screen]);
  }

  return (
    <HTMLFlipBook width={width} height={height} flippingTime={2000} showCover={true} style={{
      background: "url('/assets/vieille-bourse/cover.png') repeat",
      boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.5)",
    }}>
      <div className={styles.page && styles.pageCover} data-density="hard">
        <div className={styles.pageContent}>
          <h2>BOOK TITLE</h2>
        </div>
      </div>
      {pages.map((page, i) => {
        let content = <div className={styles.pageText} dangerouslySetInnerHTML={{__html: page.text}}/>;
        if (page.text.includes('{keyword}')) {
          // @ts-ignore
          const keyword = /\{keyword}(.+)\{\/keyword}/g.exec(page.text)[1];
          content = (
            <>
              <div className={styles.pageText} dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: page.text.split('{keyword}').shift(),
              }}/>
              {ItemFactory.create({type: "keyword", options: {debug: debug, keyword: keyword}}).render()}
              <div className={styles.pageText} dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: page.text.split('{/keyword}').pop(),
              }}/>
            </>
          );
        }

        return (
          <div className={styles.page} key={`content-${i}`}>
            <div className={styles.pageContent}>
              {content}
              <div className={styles.pageFooter}>{i}</div>
            </div>
          </div>
        );
      })}
      <div className={styles.page && styles.pageCover} data-density="hard">
        <div className={styles.pageContent}>
          <h2>FIN</h2>
        </div>
      </div>
    </HTMLFlipBook>
  );
}
