'use client';

import React, { useState } from 'react';
import TaiwanMainMap from '@svg-maps/taiwan.main';
import styled, { keyframes } from 'styled-components';
import { mapIdToChineseName } from '../constants/mapConstants';

const mapFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Tooltip = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--color-text);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-heading);
  font-weight: 500;
  white-space: nowrap;
  z-index: 999;
  pointer-events: none;
  border: 1px solid rgba(14, 165, 233, 0.25);
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.15);
  transition: opacity 0.15s ease-in-out;
  opacity: ${props => props.$show ? 1 : 0};
`;

const MapCard = styled.div`
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.12);
  padding: 16px;
  animation: ${mapFadeIn} 0.6s ease both;
`;

const MapWrapper = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  max-height: 80vh;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: 100%;

    path {
      fill: #7DD3FC;
      stroke: #ffffff;
      stroke-width: 1.5px;
      cursor: pointer;
      transition: fill 0.2s ease-in-out, filter 0.2s ease-in-out;

      &:hover {
        fill: #38BDF8;
        filter: drop-shadow(0 2px 6px rgba(14, 165, 233, 0.3));
      }

      &.selected {
        fill: #0EA5E9;
        filter: drop-shadow(0 2px 8px rgba(14, 165, 233, 0.5));
      }

      &.disabled {
        fill: #E0F2FE;
        cursor: not-allowed;
        &:hover {
          fill: #E0F2FE;
          filter: none;
        }
      }

      &:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 1px;
      }
    }
  }
`;

function TaiwanSvgMap({ selectedCounties = [], onMapClick, disabledCounties = [] }) {
  const [hoveredCounty, setHoveredCounty] = useState(null);

  const getLocationClassName = (location) => {
    const chineseName = mapIdToChineseName[location.id];
    if (!chineseName) return '';
    if (disabledCounties.includes(chineseName)) return 'disabled';
    if (selectedCounties.includes(chineseName)) return 'selected';
    return '';
  };

  const handleLocationClick = (event) => {
    const mapId = event.target.closest('path')?.id;
    if (mapId) {
      const chineseName = mapIdToChineseName[mapId];
      if (chineseName && !disabledCounties.includes(chineseName) && onMapClick) {
        onMapClick(chineseName);
      }
    }
  };

  const handleLocationMouseOver = (event) => {
    const mapId = event.target.closest('path')?.id;
    if (mapId) {
      const chineseName = mapIdToChineseName[mapId];
      if (chineseName) {
        setHoveredCounty({ name: chineseName, x: event.clientX, y: event.clientY });
      }
    }
  };

  const handleLocationMouseOut = () => {
    setHoveredCounty(null);
  };

  return (
    <>
      <MapCard>
        <MapWrapper>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={TaiwanMainMap.viewBox}
            aria-label={TaiwanMainMap.label}
            onClick={handleLocationClick}
            onMouseOver={handleLocationMouseOver}
            onMouseOut={handleLocationMouseOut}
          >
            {TaiwanMainMap.locations.map((location) => (
              <path
                key={location.id}
                id={location.id}
                name={location.name}
                d={location.path}
                className={getLocationClassName(location)}
                aria-label={location.name}
                tabIndex={0}
              />
            ))}
          </svg>
        </MapWrapper>
      </MapCard>
      {hoveredCounty && (
        <Tooltip
          $show={!!hoveredCounty}
          style={{
            top: `${hoveredCounty.y + 15}px`,
            left: `${hoveredCounty.x + 15}px`,
          }}
        >
          {hoveredCounty.name}
        </Tooltip>
      )}
    </>
  );
}

export default TaiwanSvgMap;
