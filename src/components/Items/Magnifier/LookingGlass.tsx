"use client";

import React, {RefObject, useRef, useState} from 'react';

/**
 * Component backported from https://github.com/Josh-McFarlin/react-looking-glass
 */

export type Coordinates = {
  x: number;
  y: number;
};

type MouseE = {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
};

type LookingGlassProps = {
  // large image url
  src: string;
  // the alternate text for when image cannot be displayed
  alt?: string;
  // the factor to zoom by
  zoomFactor?: number;
  // the size of the magnifier window
  size?: number;
  // the offset of the magnifier from the cursor
  cursorOffset?: Coordinates;
  // an optional higher resolution photo for the magnifier
  zoomSrc?: string;
  // will show the magnifier when zoomFactor is equal to 1
  displayZoomOne?: boolean;
  // will update the magnifier when the container scrolls, but this might break on some browsers
  scrollLinked?: boolean;
  // if true will display the magnifier as a square
  squareMagnifier?: boolean;
  // the name of the class for the image holder
  className?: string;
  // the name of the class for the image itself
  imageClassName?: string;
  // the name of the class for the magnifying glass
  zoomClassName?: string;
  // will hide the cursor when being hovered over
  hideCursor?: boolean;
  // will be called on cursor move
  onCursorMove?: (coords: Coordinates) => void;
};

export const LookingGlass: React.FC<LookingGlassProps> = ({
  src,
  alt = "",
  zoomFactor = 3,
  displayZoomOne = false,
  scrollLinked = true,
  className = "",
  imageClassName = "",
  hideCursor = true,
  onCursorMove = () => {},
  size = 200,
  cursorOffset = {x: 0, y: 0},
  squareMagnifier = false,
  zoomClassName = "",
  ...props
}) => {
  const [cursorPosition, setCursorPosition] = useState<Coordinates>({x: 0, y: 0});
  const [imageOffset, setImageOffset] = useState<Coordinates>({x: 0, y: 0});
  const [mouseE, setMouseE] = useState<MouseE>({clientX: 0, clientY: 0, pageX: 0, pageY: 0});
  const [hover, setHover] = useState<boolean>(false);
  // @ts-ignore
  const imageRef = useRef<HTMLImageElement>();

  const onEnter = (e: any) => {
    onMove(e);
    setHover(true);
  };
  const onLeave = () => {
    setHover(false);
  };
  const onMove = (e: any) => {
    if (e.hasOwnProperty("touches") || e.hasOwnProperty("changedTouches")) {
      const t = (e.changedTouches || e.touches)[0];
      const cRect = imageRef.current.getBoundingClientRect();

      if (t.clientX >= cRect.left && t.clientX <= cRect.right && t.clientY >= cRect.top && t.clientY <= cRect.bottom) {
        setPosition({
          clientX: t.clientX,
          clientY: t.clientY,
          pageX: t.pageX,
          pageY: t.pageY,
        });
      } else {
        onLeave();
      }
    } else if (e.hasOwnProperty("clientX") && e.hasOwnProperty("pageX")) {
      setPosition({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
      });
    } else {
      setPosition(mouseE);
    }
  };
  const setPosition = (mouseE: MouseE) => {
    const cRect = imageRef.current.getBoundingClientRect();

    setCursorPosition({
      x: mouseE.clientX + window.scrollX,
      y: mouseE.clientY + window.scrollY,
    });
    setImageOffset({
      x: mouseE.pageX - cRect.left - window.pageXOffset,
      y: mouseE.pageY - cRect.top - window.pageYOffset,
    });
    setMouseE(mouseE);
    onCursorMove({
      x: mouseE.clientX + window.scrollX,
      y: mouseE.clientY + window.scrollY,
    });
  };

  return (
    <div
      onScroll={scrollLinked ? onMove : undefined}
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        touchAction: 'none'
      }}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
        onTouchStart={onEnter}
        onTouchEnd={onLeave}
        onTouchCancel={onLeave}
        onTouchMove={onMove}
        ref={imageRef}
        style={{
          width: "100%",
          height: "auto",
          touchAction: 'none',
          cursor: hideCursor ? "none": "crosshair"
        }}
        className={imageClassName}
      />
      {
        (hover && zoomFactor >= 1 && (displayZoomOne || zoomFactor !== 1)) && (
          // @ts-ignore
          <Magnifier imageRef={imageRef} zoomFactor={zoomFactor} cursorPosition={cursorPosition} imageOffset={imageOffset} {...props}/>
        )
      }
    </div>
  );
}

type MagnifierProps = {
  // the ref to the image object
  imageRef: RefObject<HTMLImageElement>;
  // the offset of the zoom bubble from the cursor
  cursorOffset: Coordinates;
  // the position of the cursor on the screen
  cursorPosition: Coordinates;
  // the position of the cursor within the image
  imageOffset: Coordinates;
  // the factor to zoom by
  zoomFactor?: number;
  // the size of the magnifier window
  size?: number;
  // an optional high resolution image for the magnifier
  zoomSrc?: string;
  // if true will display the magnifier as a square instead of a circle
  squareMagnifier?: boolean;
  // the name of the class for the magnifying glass
  zoomClassName?: string;
};

const Magnifier: React.FC<MagnifierProps> = ({
  imageRef,
  zoomSrc,
  cursorPosition,
  imageOffset,
  zoomFactor = 3,
  size = 200,
  cursorOffset = {x: 0, y: 0},
  squareMagnifier = false,
  zoomClassName = "",
}) => {
  const halfSize = size / 2;
  const bgX = (-zoomFactor * imageOffset.x) + halfSize;
  const bgY = (-zoomFactor * imageOffset.y) + halfSize;
  const imageWidth = imageRef.current.offsetWidth;
  const imageHeight = imageRef.current.offsetHeight;
  const imageSrc = imageRef.current.src;

  return (
    <div
      style={{
        position: 'absolute',
        display: 'block',
        top: cursorPosition.y,
        left: cursorPosition.x,
        width: size,
        height: size,
        marginLeft: cursorOffset.x - halfSize,
        marginTop: cursorOffset.y - halfSize,
        backgroundColor: 'white',
        borderRadius: !squareMagnifier ? "50%" : "0%",
        boxShadow: `1px 1px 6px rgba(0,0,0,0.3)`,
        touchAction: 'none',
        pointerEvents: 'none',
      }}
      className={zoomClassName}
    >
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: `url("${zoomSrc != null ? zoomSrc : imageSrc}")`,
          backgroundSize: `${imageWidth * zoomFactor}px ${imageHeight * zoomFactor}px`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${bgX}px ${bgY}px`,
          borderRadius: !squareMagnifier ? "50%" : "0%",
          touchAction: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
