'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Empty, Button, message } from 'antd';
import { GlobalOutlined, EnvironmentOutlined, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const ResultContainer = styled.div`
  text-align: center;
  padding: 30px 20px;
  background-color: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #d9d9d9;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StationInfo = styled.div`
  margin-bottom: ${props => props.$isAnimating ? '0' : '24px'};
  transition: margin-bottom 0.5s ease-in-out;
  min-height: 60px;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #d9d9d9;
  width: 100%;
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  color: #1890ff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }

  .anticon {
    margin-right: 6px;
    font-size: 16px;
  }
`;

const ShareBox = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  width: 100%;
  text-align: left;
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
        <Title level={2} style={{ marginBottom: '4px', color: '#1890ff' }}>
          「{displayStationName}」{isAnimating ? '' : '車站'}
        </Title>
        {!isAnimating && station && <Text type="secondary">{station.county}</Text>}
      </StationInfo>

      {!isAnimating && station && (
        <>
          <LinksContainer>
            {station.name && (
              <StyledLink
                href={`https://zh.wikipedia.org/wiki/${station.name}車站`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobalOutlined />
                維基百科
              </StyledLink>
            )}
            {station.county && station.name && (
              <StyledLink
                href={`http://maps.google.com/maps?q=${station.county}${station.name}台鐵車站`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <EnvironmentOutlined />
                Google Map
              </StyledLink>
            )}
          </LinksContainer>

          {commentUrl && (
            <ShareBox>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                <ShareAltOutlined /> 旅行完畢後，用以下連結分享你的心得：
              </Text>
              <Text
                style={{
                  fontSize: '11px',
                  wordBreak: 'break-all',
                  color: '#1890ff',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                {commentUrl}
              </Text>
              <Button size="small" icon={<CopyOutlined />} onClick={handleCopyLink}>
                複製連結
              </Button>
            </ShareBox>
          )}
        </>
      )}
    </ResultContainer>
  );
}

export default ResultDisplay;
