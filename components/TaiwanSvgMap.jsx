'use client';

import React, { useState } from 'react';
import TaiwanMainMap from '@svg-maps/taiwan.main';
import styled from 'styled-components';
import { mapIdToChineseName } from '../constants/mapConstants';

const Tooltip = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 999;
  pointer-events: none;
  transition: opacity 0.1s ease-in-out;
  opacity: ${props => props.$show ? 1 : 0};
`;

const MapWrapper = styled.div`
  width: 100%;
  max-width: 600px;
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
      fill: #e0e0e0;
      stroke: #ffffff;
      stroke-width: 1px;
      cursor: pointer;
      transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out;

      &:hover {
        fill: #c0c0c0;
      }

      &.selected {
        fill: #1890ff;
      }

      &.disabled {
        fill: #f5f5f5;
        cursor: not-allowed;
        &:hover {
          fill: #f5f5f5;
        }
      }

      &:focus {
        outline: 2px solid;
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
