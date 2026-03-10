'use client';

import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TaiwanSvgMap from './TaiwanSvgMap';
import ResultDisplay from './ResultDisplay';
import { getRandomStation } from '../utils/stationUtils';
import stationsData from '../constants/stations.json';

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
  const [warnVisible, setWarnVisible] = useState(false);
  const [warnMode, setWarnMode] = useState('close'); // 'close' | 'link'
  const [pendingLinkUrl, setPendingLinkUrl] = useState(null);
  const [linkWarnedOnce, setLinkWarnedOnce] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const commentUrl = currentToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/comment?token=${currentToken}`
    : null;

  // X 按鈕：有 token 才攔截
  const handleModalClose = () => {
    if (currentToken) {
      setWarnMode('close');
      setWarnVisible(true);
    } else {
      setIsResultModalVisible(false);
    }
  };

  // 外部連結點擊（由 ResultDisplay 呼叫）：同一次抽站只警告一次
  const handleExternalLinkClick = (url) => {
    if (currentToken && !linkWarnedOnce) {
      setWarnMode('link');
      setPendingLinkUrl(url);
      setWarnVisible(true);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // 警告 modal 確認
  const handleWarnConfirm = () => {
    setWarnVisible(false);
    setCopySuccess(false);
    if (warnMode === 'close') {
      setIsResultModalVisible(false);
      setCurrentToken(null);
      setLinkWarnedOnce(false);
    } else {
      setLinkWarnedOnce(true);
      if (pendingLinkUrl) window.open(pendingLinkUrl, '_blank', 'noopener,noreferrer');
      setPendingLinkUrl(null);
    }
  };

  // 警告 modal 取消
  const handleWarnCancel = () => {
    setWarnVisible(false);
    if (warnMode === 'link') setPendingLinkUrl(null);
  };

  const handleCopyInWarning = () => {
    if (commentUrl) {
      navigator.clipboard.writeText(commentUrl).then(() => {
        setCopySuccess(true);
        messageApi.success('連結已複製！');
        setTimeout(() => setCopySuccess(false), 3000);
      });
    }
  };

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
    setLinkWarnedOnce(false);

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
      {contextHolder}
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
        onCancel={handleModalClose}
        maskClosable={false}
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
            onExternalLinkClick={handleExternalLinkClick}
          />
        )}
      </Modal>

      {/* 統一的心得連結警告 modal（關閉 / 外部連結點擊共用） */}
      <Modal
        open={warnVisible}
        onCancel={handleWarnCancel}
        footer={null}
        centered
        width={380}
        styles={{ body: { padding: '24px 24px 20px' } }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 14 }}>🔖</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
            {warnMode === 'close' ? '關閉前，請先保存心得連結！' : '出發前，請先保存心得連結！'}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#F97316', fontWeight: 500, marginBottom: 20 }}>
            ⚠️ 此連結僅能使用一次，旅行回來才能留言
          </div>
          <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-primary)', wordBreak: 'break-all', lineHeight: 1.6, marginBottom: 10 }}>
              {commentUrl}
            </div>
            <button
              onClick={handleCopyInWarning}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 16px', borderRadius: 16, border: '1.5px solid var(--color-primary)', background: copySuccess ? 'var(--color-primary)' : 'transparent', color: copySuccess ? '#fff' : 'var(--color-primary)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.2s ease' }}
            >
              <CopyOutlined /> {copySuccess ? '已複製！' : '複製連結'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              size="large"
              style={{ flex: 1, fontFamily: 'var(--font-body)' }}
              onClick={handleWarnCancel}
            >
              {warnMode === 'close' ? '留在這裡' : '等等，先複製'}
            </Button>
            <Button
              size="large"
              type={warnMode === 'close' ? 'default' : 'primary'}
              danger={warnMode === 'close'}
              style={{ flex: 1, fontFamily: 'var(--font-body)' }}
              onClick={handleWarnConfirm}
            >
              {warnMode === 'close' ? '確認關閉' : '繼續前往'}
            </Button>
          </div>
        </div>
      </Modal>

    </AppContainer>
  );
}
