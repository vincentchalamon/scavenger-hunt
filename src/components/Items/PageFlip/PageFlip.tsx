"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useEffect, useState} from "react";
import {Button, Image as Img} from "react-bootstrap";
import HTMLFlipBook from "react-pageflip";
import styles from "./pageFlip.module.css";
import {ItemFactory} from "@/components/Items/ItemFactory";

interface PageProps {
  text: string,
}

interface PageFlipProps {
  icon: string,
  pages: PageProps[],
}

export class PageFlip extends Item {
  constructor(private options: PageFlipProps) {
    super();
  }

  renderButton(): ReactNode {
    return (
      // @ts-ignore
      <Button variant="link" className="p-0 h-100 w-100">
        <Img src={this.options.icon} className="w-100 h-100"/>
      </Button>
    );
  }

  onHide(): void {
  }

  onShow(): void {
  }

  render(): ReactNode {
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
      <div className="d-flex flex-column justify-content-center align-items-center w-100 mw-100 mh-100">
        <HTMLFlipBook width={width} height={height} flippingTime={2000} showCover={true} style={{
          background: "url('/assets/vieille-bourse/cover.png') repeat",
          boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.5)",
        }}>
          <div className={styles.page && styles.pageCover} data-density="hard">
            <div className={styles.pageContent}>
              <h2>BOOK TITLE</h2>
            </div>
          </div>
          {this.options.pages.map((page, i) => {
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
                  {ItemFactory.create({type: "keyword", options: {keyword: keyword}}).render()}
                  <div className={styles.pageText} dangerouslySetInnerHTML={{
                    // @ts-ignore
                    __html: page.text.split('{/keyword}').pop(),
                  }}/>
                </>
              );
            }

            return (
              <div className={styles.page} key={i}>
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
      </div>
    );
  }
}
