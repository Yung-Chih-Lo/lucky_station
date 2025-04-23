// src/components/ResultDisplay.jsx
import React, { useState, useEffect } from 'react'; // 導入 useState 和 useEffect
import { Typography, Empty } from 'antd';
import { GlobalOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

// 頁面主要的結果顯示容器
const ResultContainer = styled.div`
  text-align: center;
  padding: 30px 20px;
  background-color: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto; // 在 Modal 中使用時，上下外邊距由 Modal 的內容區域控制
  border: 1px solid #d9d9d9;
  min-height: 200px; // 設定一個最小高度，避免動畫時內容跳動
  display: flex; // 使用 flexbox
  flex-direction: column; // 垂直排列
  justify-content: center; // 內容垂直居中
  align-items: center; // 內容水平居中
`;

// 包裹車站名稱和縣市的容器
const StationInfo = styled.div`
  // 動畫時移除下邊距，動畫結束後恢復，增加過渡效果
  margin-bottom: ${props => props.$isAnimating ? '0' : '24px'};
  transition: margin-bottom 0.5s ease-in-out; // 調整過渡時長和效果
  min-height: 60px; // 設定最小高度，避免文字行高變化造成跳動
`;

// 包裹連結的容器
const LinksContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #d9d9d9;
  width: 100%;
`;

// 個別連結的樣式
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

// Helper function to pick a random station name from the full data
const pickRandomStationName = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return "載入中..."; // Fallback if data is empty
  }
  const counties = Object.keys(data);
  const randomCounty = counties[Math.floor(Math.random() * counties.length)];
  const stationsInCounty = data[randomCounty];
  if (!stationsInCounty || stationsInCounty.length === 0) {
       // 如果該縣市沒有車站，嘗試從其他縣市選擇
       if (counties.length > 1) {
           const otherCounties = counties.filter(c => c !== randomCounty);
           const fallbackCounty = otherCounties[Math.floor(Math.random() * otherCounties.length)];
           const fallbackStations = data[fallbackCounty];
           if (fallbackStations && fallbackStations.length > 0) {
              return fallbackStations[Math.floor(Math.random() * fallbackStations.length)];
           }
       }
       return "無車站資料"; // 如果所有縣市都沒車站
  }
  const randomStation = stationsInCounty[Math.floor(Math.random() * stationsInCounty.length)];
  return randomStation;
};


// 接收 station (最終結果) 和 allStationsData (所有車站資料) 作為 props
function ResultDisplay({ station, allStationsData }) {
  const [isAnimating, setIsAnimating] = useState(false); // 是否正在動畫
  const [displayStationName, setDisplayStationName] = useState(''); // 動畫時顯示的車站名稱

  // 使用 useEffect 來監聽 station prop 的變化
  useEffect(() => {
    let intervalId = null;
    let timeoutId = null;

    // 當 station prop 收到一個非 null 的值時，觸發動畫
    // 這裡的邏輯是：只要 station 變化 (從 null 到有值，或從一個值變到另一個值)，就重新跑動畫
    if (station && allStationsData && Object.keys(allStationsData).length > 0) {
      setIsAnimating(true); // 開始動畫
      // 設定一個初始顯示的名稱，或開始隨機跳動
      setDisplayStationName(pickRandomStationName(allStationsData));

      // 設定定時器，快速切換車站名稱
      intervalId = setInterval(() => {
        setDisplayStationName(pickRandomStationName(allStationsData));
      }, 80); // 數字越小，切換越快 (例如 50ms, 80ms, 100ms)

      // 設定延遲器，一段時間後停止動畫，顯示最終結果
      const animationDuration = 2000; // 動畫總時長 (毫秒)，約兩秒
      timeoutId = setTimeout(() => {
        clearInterval(intervalId); // 停止定時器
        setIsAnimating(false); // 停止動畫狀態
        setDisplayStationName(station.name); // 顯示最終車站名稱
      }, animationDuration);

    } else {
        // 當 station 為 null 時，重置狀態
        setIsAnimating(false);
        setDisplayStationName('');
    }

    // 清理函數：在元件卸載或 station prop 再次改變時清除定時器和延遲器
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };

  }, [station, allStationsData]); // 依賴於 station 和 allStationsData 的變化

  // 如果沒有 station 且沒有正在動畫，則顯示 Empty 狀態
  if (!station && !isAnimating) {
    return (
      <ResultContainer>
        <Empty description="尚未抽取目的地" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </ResultContainer>
    );
  }

  // 渲染結果，根據是否正在動畫來顯示不同內容
  return (
    <ResultContainer>
      {/* 包裹車站名稱和縣市，根據動畫狀態調整間距 */}
      <StationInfo $isAnimating={isAnimating}>
        {/* 動畫時只顯示跳動的車站名稱，動畫結束後顯示最終名稱和「車站」字樣 */}
        <Title level={2} style={{ marginBottom: '4px', color: '#1890ff' }}>
          「{displayStationName}」{isAnimating ? '' : '車站'}
        </Title>
        {/* 非動畫狀態才顯示縣市 */}
        {!isAnimating && station && <Text type="secondary">{station.county}</Text>}
      </StationInfo>
      {!isAnimating && station && (
        <LinksContainer>
          {station.name && (
            <StyledLink href={`https://zh.wikipedia.org/wiki/${station.name}車站`} target="_blank" rel="noopener noreferrer">
              <GlobalOutlined />
              維基百科
            </StyledLink>
          )}
          {station.county && station.name && (
             // 修正 Google Maps 搜尋連結格式
             <StyledLink href={`http://maps.google.com/maps?q=${station.county}${station.name}台鐵車站`} target="_blank" rel="noopener noreferrer">
                <EnvironmentOutlined />
                Google Map
              </StyledLink>
          )}
        </LinksContainer>
      )}
    </ResultContainer>
  );
}

export default ResultDisplay;