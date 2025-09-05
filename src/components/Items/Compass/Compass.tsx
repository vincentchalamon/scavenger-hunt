"use client";

import {Item} from "@/components/Items/Item";
import React, {ReactNode, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {ModalItem} from "@/components/Items";

interface CompassProps {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export class Compass extends Item {
  constructor(private options: CompassProps) {
    super();
  }

  render(): ReactNode {
    const [pointDegree, setPointDegree] = useState<number>(0);
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(({coords}) => {
        const phiK = (this.options.coordinates.latitude * Math.PI) / 180.0;
        const lambdaK = (this.options.coordinates.longitude * Math.PI) / 180.0;
        const phi = (coords.latitude * Math.PI) / 180.0;
        const lambda = (coords.longitude * Math.PI) / 180.0;
        const psi = (180.0 / Math.PI) * Math.atan2(
          Math.sin(lambdaK - lambda),
          Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
        );

        let pointDegree = Math.round(psi);
        if (pointDegree < 0) {
          pointDegree = pointDegree + 360;
        }

        setPointDegree(pointDegree);
      })
    }, [navigator.geolocation]);

    const [angle, setAngle] = useState<number>(0);
    // @ts-ignore
    const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    useEffect(() => {
      if (typeof window === "undefined") {
        return;
      }

      // @ts-ignore
      const handler = (e) => {
        const compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
        setAngle(compass);
      };

      const startCompassIOS = async () => {
        // @ts-ignore
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          try {
            // @ts-ignore
            const response = await DeviceOrientationEvent.requestPermission();
            if (response === "granted") {
              window.addEventListener("deviceorientation", handler, true);
            } else {
              alert("Permission to access device orientation is required!");
            }
          } catch {
            alert("Device orientation is not supported");
          }
        }
      };

      if (isIOS) {
        startCompassIOS();
      } else {
        window.addEventListener("deviceorientationabsolute", handler, true);
      }

      return () => {
        if (isIOS) {
          window.removeEventListener("deviceorientation", handler, true);
        } else {
          window.removeEventListener("deviceorientationabsolute", handler, true);
        }
      };
    }, []);

    return (
      <ModalItem button={<Button variant="primary">Compass</Button>}>
        <div className="position-relative w-100 rounded-5 m-0" style={{
          maxWidth: '95%',
          height: '350px',
        }}>
          <div className="position-absolute w-0 h-0 start-50 z-1" style={{
            top: '-35px',
            transform: 'translateX(-50%)',
            borderStyle: 'solid',
            borderWidth: '30px 20px 0 20px',
            borderColor: 'red transparent transparent transparent',
          }}/>
          <div className="position-absolute w-100 h-100 top-50 start-50" style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            background: 'url(/assets/compass.png) center no-repeat',
            backgroundSize: 'contain',
          }}/>
          <div className="position-absolute rounded w-100 h-100 top-50 start-50 opacity-0 w-25 h-25" style={{
            transform: 'translate(-50%, -50%)',
            background: 'rgb(8, 223, 69)',
          }}/>
        </div>
      </ModalItem>
    );
  }
}
