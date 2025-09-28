"use client";

import {Item} from "@/components/Items";
import React, {ReactNode, useEffect, useState} from "react";
import HTMLFlipBook from "react-pageflip";
import styles from "./pageFlip.module.css";
import {ItemOptionsType} from "@/types/Item";
import {Image as Img} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";

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
  const [height, setHeight] = useState<number>(300);
  const [width, setWidth] = useState<number>(100);
  const {addKeyword} = useKeyword();

  if (typeof screen !== "undefined") {
    useEffect(() => {
      // Total height - bottom navbar - top navbar
      setHeight((screen.height / 2) - 40 - 59);
      setWidth((screen.width / 2) - 10);
    }, []);
  }

  const onClick = (e: any, keyword: string) => {
    if (e.target.classList.contains("keyword")) {
      addKeyword(keyword);
    }
  };

  return (
    // @ts-ignore
    <HTMLFlipBook
      clickEventForward={true}
      width={width}
      height={height}
      flippingTime={2000}
      className="py-1"
      style={{
        backgroundImage: "url('/assets/book.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className={styles.page && styles.pageCover && styles.pageCoverTop}/>
      {pages.map((page, i) => {
        let content = <div className={styles.pageText} dangerouslySetInnerHTML={{__html: page.text}}/>;
        if (page.text.includes('{keyword}')) {
          // @ts-ignore
          const keyword = /\{keyword}(.+)\{\/keyword}/g.exec(page.text)[1];
          content = (
            <>
              <div className={styles.pageText} dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: page.text.replace(/\{keyword}(.+)\{\/keyword}/g, `<a class="keyword">${keyword}</a>`),
              }} onClick={(e) => onClick(e, keyword)}/>
            </>
          );
        }

        return (
          <div className={styles.page} key={`content-${i}`}>
            <div className={styles.pageContent}>
              {content}
            </div>
          </div>
        );
      })}
      <div className={styles.page && styles.pageCover && styles.pageCoverBottom} data-density="hard"/>
    </HTMLFlipBook>
  );
}
