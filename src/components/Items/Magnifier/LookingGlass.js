"use client";

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component backported from https://github.com/Josh-McFarlin/react-looking-glass
 */
class LookingGlass extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cursorPosition: {
        x: 0,
        y: 0
      },
      imageOffset: {
        x: 0,
        y: 0
      },
      mouseE: {
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0
      },
      hover: false
    };

    this.imageRef = React.createRef();

    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onMove = this.onMove.bind(this);
    this.setPosition = this.setPosition.bind(this);
  }

  onEnter(e) {
    this.onMove(e);

    this.setState({
      hover: true
    });
  }

  onLeave() {
    this.setState({
      hover: false
    });
  }

  onMove(e) {
    if (e.hasOwnProperty("touches") || e.hasOwnProperty("changedTouches")) {
      const t = (e.changedTouches || e.touches)[0];
      const cRect = this.imageRef.current.getBoundingClientRect();

      if (t.clientX >= cRect.left && t.clientX <= cRect.right && t.clientY >= cRect.top && t.clientY <= cRect.bottom) {
        this.setPosition({
          clientX: t.clientX,
          clientY: t.clientY,
          pageX: t.pageX,
          pageY: t.pageY
        });
      } else {
        this.onLeave();
      }
    } else if (e.hasOwnProperty("clientX") && e.hasOwnProperty("pageX")) {
      this.setPosition({
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY
      });
    } else {
      this.setPosition(this.state.mouseE);
    }
  }

  setPosition(mouseE) {
    const cRect = this.imageRef.current.getBoundingClientRect();

    this.setState({
      cursorPosition: {
        x: mouseE.clientX + window.scrollX,
        y: mouseE.clientY + window.scrollY
      },
      imageOffset: {
        x: mouseE.pageX - cRect.left - window.pageXOffset,
        y: mouseE.pageY - cRect.top - window.pageYOffset
      },
      mouseE
    });
    this.props.onCursorMove({
      x: mouseE.clientX + window.scrollX,
      y: mouseE.clientY + window.scrollY
    });
  }

  render() {
    let { src, alt, zoomFactor, displayZoomOne, scrollLinked, className, imageClassName, hideCursor, ...restProps } = this.props;
    let { hover, ...restState } = this.state;

    return (
      <div
        onScroll={scrollLinked ? this.onMove : undefined}
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
          onMouseEnter={this.onEnter}
          onMouseLeave={this.onLeave}
          onMouseMove={this.onMove}
          onTouchStart={this.onEnter}
          onTouchEnd={this.onLeave}
          onTouchCancel={this.onLeave}
          onTouchMove={this.onMove}
          ref={this.imageRef}
          style={{
            width: "100%",
            height: "auto",
            touchAction: 'none',
            cursor: hideCursor === true ? "none": "crosshair"
          }}
          className={imageClassName}
        />

        {
          (hover && zoomFactor >= 1 && (displayZoomOne || zoomFactor !== 1)) &&
          <Magnifier
            imageRef={this.imageRef}
            zoomFactor={zoomFactor}
            {...restState}
            {...restProps}
          />
        }
      </div>
    );
  }
}

LookingGlass.propTypes = {
  // large image url
  src: PropTypes.string.isRequired,

  // the alternate text for when image cannot be displayed
  alt: PropTypes.string.isRequired,

  // the factor to zoom by
  zoomFactor: PropTypes.number.isRequired,

  // the size of the magnifier window
  size: PropTypes.number,

  // the offset of the magnifier from the cursor
  cursorOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),

  // an optional higher resolution photo for the magnifier
  zoomSrc: PropTypes.string,

  // will show the magnifier when zoomFactor is equal to 1
  displayZoomOne: PropTypes.bool,

  // will update the magnifier when the container scrolls, but this might break on some browsers
  scrollLinked: PropTypes.bool,

  // if true will display the magnifier as a square
  squareMagnifier: PropTypes.bool,

  // the name of the class for the image holder
  className: PropTypes.string,

  // the name of the class for the image itself
  imageClassName: PropTypes.string,

  // the name of the class for the magnifying glass
  zoomClassName: PropTypes.string,

  // will hide the cursor when being hovered over
  hideCursor: PropTypes.bool,

  // will be called on cursor move
  onCursorMove: PropTypes.func,
};

LookingGlass.defaultProps = {
  zoomFactor: 3,
  size: 200,
  cursorOffset: { x: 0, y: 0 },
  alt: "",
  displayZoomOne: false,
  scrollLinked: true,
  squareMagnifier: false,
  hideCursor: true,
  onCursorMove: () => {},
};

export default LookingGlass;

class Magnifier extends React.PureComponent {
  render() {
    let { imageRef, zoomFactor, size, cursorOffset, zoomSrc, cursorPosition, imageOffset, squareMagnifier, zoomClassName } = this.props;

    let halfSize = size / 2;
    let bgX = (-zoomFactor * imageOffset.x) + halfSize;
    let bgY = (-zoomFactor * imageOffset.y) + halfSize;

    let imageWidth = imageRef.current.offsetWidth;
    let imageHeight = imageRef.current.offsetHeight;
    let imageSrc = imageRef.current.src;

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
}

Magnifier.propTypes = {
  // the ref to the image object
  imageRef: PropTypes.object.isRequired,

  // the factor to zoom by
  zoomFactor: PropTypes.number.isRequired,

  // the size of the magnifier window
  size: PropTypes.number.isRequired,

  // the offset of the zoom bubble from the cursor
  cursorOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,

  // an optional high resolution image for the magnifier
  zoomSrc: PropTypes.string,

  // the position of the cursor on the screen
  cursorPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,

  // the position of the cursor within the image
  imageOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,

  // if true will display the magnifier as a square instead of a circle
  squareMagnifier: PropTypes.bool,

  // the name of the class for the magnifying glass
  zoomClassName: PropTypes.string
};
