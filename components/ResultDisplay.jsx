'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Empty, message } from 'antd';
import { GlobalOutlined, EnvironmentOutlined, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Text } = Typography;

const revealIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ResultContainer = styled.div`
  text-align: center;
  padding: 36px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.25);
  max-width: 420px;
  margin: 0 auto;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StationName = styled.div`
  font-family: var(--font-heading);
  font-size: ${props => props.$isAnimating ? '28px' : '36px'};
  font-weight: 700;
  color: ${props => props.$isAnimating ? 'var(--color-secondary)' : 'var(--color-primary)'};
  margin-bottom: 4px;
  transition: font-size 0.3s ease, color 0.3s ease;
  animation: ${props => !props.$isAnimating ? revealIn : 'none'} 0.4s ease both;
  opacity: ${props => props.$isAnimating ? 0.75 : 1};
  letter-spacing: 2px;
`;

const CountyLabel = styled.div`
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  animation: ${revealIn} 0.4s ease 0.1s both;
`;

const StationInfo = styled.div`
  margin-bottom: ${props => props.$isAnimating ? '0' : '16px'};
  transition: margin-bottom 0.5s ease-in-out;
  min-height: 60px;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(14, 165, 233, 0.25);
  width: 100%;
  animation: ${revealIn} 0.4s ease 0.2s both;
`;

const PillLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 24px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1.5px solid;

  ${props => props.$variant === 'wiki' ? `
    color: #0EA5E9;
    border-color: #0EA5E9;
    background: rgba(14, 165, 233, 0.06);
    &:hover {
      background: #0EA5E9;
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
    }
  ` : `
    color: #F97316;
    border-color: #F97316;
    background: rgba(249, 115, 22, 0.06);
    &:hover {
      background: #F97316;
      color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(249, 115, 22, 0.35);
    }
  `}

  .anticon {
    font-size: 15px;
  }
`;

const ShareBox = styled.div`
  margin-top: 20px;
  padding: 14px 16px;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.25);
  border-radius: 12px;
  width: 100%;
  text-align: left;
  animation: ${revealIn} 0.4s ease 0.3s both;
`;

const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  border-radius: 16px;
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-primary);
    color: #fff;
  }
`;

const pickRandomStationName = (data) => {
  if (!data || Object.keys(data).length === 0) return '載入中...';
  const counties = Object.keys(data);
  const randomCounty = counties[Math.floor(Math.random() * counties.length)];
  const stationsInCounty = data[randomCounty];
  if (!stationsInCounty || stationsInCounty.length === 0) return '無車站資料';
  return stationsInCounty[Math.floor(Math.random() * stationsInCounty.length)];
};

function ResultDisplay({ station, allStationsData, token }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayStationName, setDisplayStationName] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;

    if (station && allStationsData && Object.keys(allStationsData).length > 0) {
      setIsAnimating(true);
      setDisplayStationName(pickRandomStationName(allStationsData));

      intervalId = setInterval(() => {
        setDisplayStationName(pickRandomStationName(allStationsData));
      }, 80);

      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setIsAnimating(false);
        setDisplayStationName(station.name);
      }, 2000);
    } else {
      setIsAnimating(false);
      setDisplayStationName('');
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [station, allStationsData]);

  if (!station && !isAnimating) {
    return (
      <ResultContainer>
        <Empty description="尚未抽取目的地" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </ResultContainer>
    );
  }

  const commentUrl = token ? `${typeof window !== 'undefined' ? window.location.origin : ''}/comment?token=${token}` : null;

  const handleCopyLink = () => {
    if (commentUrl) {
      navigator.clipboard.writeText(commentUrl).then(() => {
        messageApi.success('連結已複製！');
      });
    }
  };

  return (
    <ResultContainer>
      {contextHolder}
      <StationInfo $isAnimating={isAnimating}>
        <StationName $isAnimating={isAnimating}>
          「{displayStationName}」{isAnimating ? '' : '車站'}
        </StationName>
        {!isAnimating && station && (
          <CountyLabel>{station.county}</CountyLabel>
        )}
      </StationInfo>

      {!isAnimating && station && (
        <>
          <LinksContainer>
            {station.name && (
              <PillLink
                href={`https://zh.wikipedia.org/wiki/${station.name}車站`}
                target="_blank"
                rel="noopener noreferrer"
                $variant="wiki"
              >
                <GlobalOutlined />
                維基百科
              </PillLink>
            )}
            {station.county && station.name && (
              <PillLink
                href={`http://maps.google.com/maps?q=${station.county}${station.name}台鐵車站`}
                target="_blank"
                rel="noopener noreferrer"
                $variant="maps"
              >
                <EnvironmentOutlined />
                Google Map
              </PillLink>
            )}
          </LinksContainer>

          {commentUrl && (
            <ShareBox>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}>
                <ShareAltOutlined /> 旅行完畢後，用以下連結分享你的心得：
              </Text>
              <Text
                style={{
                  fontSize: '11px',
                  wordBreak: 'break-all',
                  color: 'var(--color-primary)',
                  display: 'block',
                  marginBottom: '10px',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {commentUrl}
              </Text>
              <CopyButton onClick={handleCopyLink}>
                <CopyOutlined />
                複製連結
              </CopyButton>
            </ShareBox>
          )}
        </>
      )}
    </ResultContainer>
  );
}

export default ResultDisplay;
