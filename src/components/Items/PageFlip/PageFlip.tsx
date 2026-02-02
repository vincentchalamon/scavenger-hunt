"use client";

import React, {useEffect, useState} from "react";
import HTMLFlipBook from "react-pageflip";
import styles from "./pageFlip.module.css";
import {Image as Img} from "react-bootstrap";
import {useKeyword} from "@/contexts/PhraseContext";
import {assetPath} from "@/lib/assets";

type PageProps = {
  text: string;
}

export type PageFlipProps = {
  debug?: boolean;
  image: string;
  pages: PageProps[];
}

export const PageFlipButton: React.FC<PageFlipProps> = ({image}) => (
  <Img src={image} className="w-100 mh-100"/>
);

export const PageFlip: React.FC<PageFlipProps> = ({image, pages, debug}) => {
  const [height, setHeight] = useState<number>(300);
  const [width, setWidth] = useState<number>(100);
  const {addKeyword} = useKeyword();

  if (typeof window !== "undefined") {
    // Total height - bottom navbar - top navbar
    useEffect(() => {
      setHeight((window.innerHeight / 2) - 40 - 59);
      setWidth((window.innerWidth / 2) - 10);
    }, []);
  }

  const onClick = (e: any, keyword: string) => {
    if (e.target.classList.contains("keyword")) {
      addKeyword(keyword);
    }
  };

  const pageStyle = {
    backgroundImage: `url('${assetPath('/assets/page.png')}')`,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    backgroundBlendMode: "lighten",
    boxShadow: "inset 7px 0 30px -7px rgba(0, 0, 0, 0.6)",
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
        backgroundImage: `url('${assetPath('/assets/book.png')}')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={styles.page && styles.pageCover && styles.pageCoverTop} style={pageStyle}/>
      {pages.map((page, i) => {
        let content = <div className={styles.pageText} dangerouslySetInnerHTML={{__html: page.text}}/>;
        if (page.text.includes('{keyword}')) {
          // @ts-ignore
          const keyword = /\{keyword}(.+)\{\/keyword}/g.exec(page.text)[1];
          content = (
            <>
              <div className={styles.pageText} dangerouslySetInnerHTML={{
                // @ts-ignore
                __html: page.text.replace(/\{keyword}(.+)\{\/keyword}/g, `<a class="keyword" data-testid="keyword-button">${keyword}</a>`),
              }} onClick={(e) => onClick(e, keyword)}/>
            </>
          );
        }

        return (
          <div className={styles.page} style={pageStyle} key={`content-${i}`}>
            <div className={styles.pageContent}>
              {content}
            </div>
          </div>
        );
      })}
      <div className={styles.page && styles.pageCover && styles.pageCoverBottom} style={pageStyle} data-density="hard"/>
    </HTMLFlipBook>
  );
}
