'use client';

import React, { useState } from 'react';
import { Button, Typography, Modal } from 'antd';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TaiwanSvgMap from './TaiwanSvgMap';
import ResultDisplay from './ResultDisplay';
import { getRandomStation } from '../utils/stationUtils';
import stationsData from '../constants/stations.json';

const { Title } = Typography;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: row;
  background: linear-gradient(135deg, var(--color-bg-start) 0%, var(--color-bg-end) 100%);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarArea = styled.div`
  background: rgba(255, 255, 255, var(--glass-opacity));
  backdrop-filter: blur(var(--blur-amount));
  -webkit-backdrop-filter: blur(var(--blur-amount));
  border-right: var(--border-glass);
  box-shadow: var(--shadow-glass);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 280px;
  animation: fadeInUp 0.5s ease both;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: var(--border-glass);
    order: 2;
  }
`;

const MainArea = styled.div`
  flex-grow: 1;
  padding: 24px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInUp 0.5s ease 0.1s both;

  @media (max-width: 768px) {
    padding: 16px;
    order: 1;
  }
`;

const NavBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
`;

const NavLink = styled.a`
  color: var(--color-primary);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(14, 165, 233, 0.25);
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(14, 165, 233, 0.1);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
`;

const MapTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 24px;
`;

const modalTitles = [
  '命運的列車將開往...',
  '今天的幸運車站是？',
  '鐵道旅行，下一站是？',
  '隨機車站大放送！',
  '你的專屬目的地揭曉！',
  '旅途的驚喜是...',
  '下一站，你的未知旅程',
];

export default function MainApp() {
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [randomStation, setRandomStation] = useState(null);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentToken, setCurrentToken] = useState(null);
  const [isPicking, setIsPicking] = useState(false);

  const handleSelectionChange = (countyOrList) => {
    if (Array.isArray(countyOrList)) {
      setSelectedCounties(countyOrList);
    } else {
      setSelectedCounties(prev =>
        prev.includes(countyOrList)
          ? prev.filter(c => c !== countyOrList)
          : [...prev, countyOrList]
      );
    }
    setRandomStation(null);
    setIsResultModalVisible(false);
    setCurrentToken(null);
  };

  const handleRandomPick = async () => {
    if (selectedCounties.length === 0) return;

    const station = getRandomStation(selectedCounties, stationsData);
    if (!station) return;

    setIsPicking(true);
    setRandomStation(station);
    setTitleIndex(prev => (prev + 1) % modalTitles.length);
    setIsResultModalVisible(true);

    // 非同步記錄抽站並取得 token（不阻擋 UI）
    try {
      const res = await fetch('/api/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station_name: station.name, county: station.county }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentToken(data.token);
      }
    } catch {
      // token 取得失敗不影響主功能
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <AppContainer>
      <SidebarArea>
        <Sidebar
          selectedCounties={selectedCounties}
          onChange={handleSelectionChange}
          traStationsData={stationsData}
          onRandomPick={handleRandomPick}
          isPickButtonDisabled={selectedCounties.length === 0 || isPicking}
        />
      </SidebarArea>

      <MainArea>
        <NavBar>
          <NavLink href="/stats">📊 抽站排行</NavLink>
          <NavLink href="/explore">💬 旅人心得</NavLink>
        </NavBar>
        <MapTitle>點選地圖或勾選縣市來決定範圍</MapTitle>
        <TaiwanSvgMap
          selectedCounties={selectedCounties}
          onMapClick={handleSelectionChange}
        />
      </MainArea>

      <Modal
        title={
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', display: 'block', textAlign: 'center' }}>
            {modalTitles[titleIndex]}
          </span>
        }
        open={isResultModalVisible}
        onCancel={() => setIsResultModalVisible(false)}
        footer={null}
        centered
        styles={{
          content: {
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 20px 60px rgba(14, 165, 233, 0.25)',
          },
          header: {
            background: 'transparent',
            borderBottom: '1px solid rgba(14, 165, 233, 0.15)',
          },
        }}
      >
        {isResultModalVisible && (
          <ResultDisplay
            station={randomStation}
            allStationsData={stationsData}
            token={currentToken}
          />
        )}
      </Modal>
    </AppContainer>
  );
}
