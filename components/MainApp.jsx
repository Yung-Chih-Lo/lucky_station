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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarArea = styled.div`
  background-color: #fff;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.08);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 280px;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    box-shadow: none;
    border-bottom: 1px solid #d9d9d9;
    order: 2;
  }
`;

const MainArea = styled.div`
  flex-grow: 1;
  padding: 24px;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;

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
          <Button type="link" href="/stats">📊 抽站排行</Button>
          <Button type="link" href="/explore">💬 旅人心得</Button>
        </NavBar>
        <Title level={3} style={{ marginBottom: '24px', color: '#595959', textAlign: 'center' }}>
          點選地圖或勾選縣市來決定範圍
        </Title>
        <TaiwanSvgMap
          selectedCounties={selectedCounties}
          onMapClick={handleSelectionChange}
        />
      </MainArea>

      <Modal
        title={
          <Title level={4} style={{ textAlign: 'center', margin: 0 }}>
            {modalTitles[titleIndex]}
          </Title>
        }
        open={isResultModalVisible}
        onCancel={() => setIsResultModalVisible(false)}
        footer={null}
        centered
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
