// src/components/TaiwanSvgMap/TaiwanSvgMap.jsx
import React, { useState } from 'react'; // Import useState
import TaiwanMainMap from '@svg-maps/taiwan.main';
import { SVGMap } from 'react-svg-map';
import styled from 'styled-components';
import { mapIdToChineseName } from '../constants/mapConstants';

// 用來作為提示目前滑鼠停留的縣市中文名稱
const Tooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 999;
  pointer-events: none; // Prevent tooltip from interfering with mouse events
  transition: opacity 0.1s ease-in-out;
  opacity: ${props => props.$show ? 1 : 0}; // Use transient prop $show
`;

const MapWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  max-height: 80vh; // Using the value from your provided code
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; // Needed if Tooltip positioning is relative to wrapper

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
      transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out; // Added stroke transition

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

      /* Customized focus outline */
      &:focus {
        outline: 2px solid; /* Example: Red solid outline */
        outline-offset: 1px;
      }
    }
  }
`;


function TaiwanSvgMap({ selectedCounties = [], onMapClick, disabledCounties = [] }) {
  // State for tracking hovered county and mouse position
  const [hoveredCounty, setHoveredCounty] = useState(null); // { name: string, x: number, y: number } | null

  const getLocationClassName = (location) => {
    const mapId = location.id;
    const chineseName = mapIdToChineseName[mapId];
    if (!chineseName) return '';
    if (disabledCounties.includes(chineseName)) return 'disabled';
    if (selectedCounties.includes(chineseName)) return 'selected';
    return '';
  };

  const handleLocationClick = (event) => {
    const targetPath = event.target.closest('path');
    const mapId = targetPath?.id;
    if (mapId) {
        const chineseName = mapIdToChineseName[mapId];
        // Removed console.log
        if (chineseName && !disabledCounties.includes(chineseName) && onMapClick) {
            onMapClick(chineseName);
        }
    }
  };

  // Mouse hover event handlers
  const handleLocationMouseOver = (event) => {
    const targetPath = event.target.closest('path');
    const mapId = targetPath?.id;
    if (mapId) {
      const chineseName = mapIdToChineseName[mapId];
      if (chineseName) {
        setHoveredCounty({
          name: chineseName,
          x: event.clientX, // Position relative to viewport
          y: event.clientY, // Position relative to viewport
        });
      }
    }
  };

  const handleLocationMouseOut = () => {
    setHoveredCounty(null);
  };

  return (
    <> {/* Use Fragment to render MapWrapper and Tooltip side-by-side */}
      <MapWrapper>
        <SVGMap
          map={TaiwanMainMap}
          locationClassName={getLocationClassName}
          onLocationClick={handleLocationClick}
          onLocationMouseOver={handleLocationMouseOver}
          onLocationMouseOut={handleLocationMouseOut}
        />
      </MapWrapper>

      {/* Conditionally render the Tooltip */}
      {hoveredCounty && (
        <Tooltip
          $show={!!hoveredCounty} // Pass state to styled-component prop
          style={{
            // Position tooltip near the cursor
            top: `${hoveredCounty.y + 15}px`, // Offset slightly below cursor
            left: `${hoveredCounty.x + 15}px`, // Offset slightly right of cursor
          }}
        >
          {hoveredCounty.name}
        </Tooltip>
      )}
    </>
  );
}

export default TaiwanSvgMap;