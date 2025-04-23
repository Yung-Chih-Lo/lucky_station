// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Button, Typography, Modal } from 'antd'; // 保留需要的 antd 元件
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import TaiwanSvgMap from './components/TaiwanSvgMap';
import ResultDisplay from './components/ResultDisplay';
import { getRandomStation } from './utils/stationUtils';
import stationsData from './data/stations.json'; // 引入你的 JSON 資料

// 移除 Ant Design Layout 相關的引入，改用 styled components
// const { Sider, Content } = Layout;
const { Title } = Typography;


// 應用程式主要容器，用於控制整體佈局和 RWD
const AppContainer = styled.div`
  display: flex; // 啟用 Flexbox 佈局
  min-height: 100vh; // 最小高度填滿視窗

  // 預設為桌機版佈局 (水平排列)
  flex-direction: row;

  @media (max-width: 768px) {
    // 行動版佈局 (垂直堆疊，地圖在上，Sidebar 內容在下)
    flex-direction: column;
    // 對調順序，讓 MainArea (地圖) 在上方
    // 使用 order 屬性可以改變 flex 項目的排列順序，不影響原始 DOM 結構
  }
`;

// Sidebar 內容區域的樣式
const SidebarArea = styled.div`
  background-color: #fff;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.08); // 桌機版側邊陰影
  flex-shrink: 0; // 防止在水平佈局時 Sidebar 被壓縮
  display: flex; // 使其內部可以使用 flexbox (例如 SidebarWrapper 就可以填滿高度)
  flex-direction: column; // 內部垂直排列

  // 桌機版寬度固定
  width: 280px;

  @media (max-width: 768px) {
    // 行動版樣式
    width: 100%; // 全寬
    height: auto; // 高度由內容決定
    box-shadow: none; // 移除側邊陰影
    border-bottom: 1px solid #d9d9d9; // 增加下方分隔線
    order: 2; // 在行動版時，將 SidebarArea 放在第二個位置 (地圖下方)
  }
`;

// 主要內容區域 (包含地圖和地圖上方的標題) 的樣式
const MainArea = styled.div`
  flex-grow: 1; // 填滿剩餘空間
  padding: 24px; // 主要內容區域內邊距
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column; // 內部元素垂直堆疊 (例如標題和地圖)
  align-items: center; // 內部元素水平居中

  @media (max-width: 768px) {
    padding: 16px; // 行動版調整內邊距
    order: 1; // 在行動版時，將 MainArea 放在第一個位置 (地圖上方)
    // 地圖本身會縮放以適應寬度，但可以設定最大寬度讓它在大螢幕不要過大
    // 地圖的高度會根據 SVG 的比例和容器寬度自動調整
  }
`;


// 定義一系列有創意的 Modal 標題 (抽取結果 Modal 使用)
const modalTitles = [
  '命運的列車將開往...',
  '今天的幸運車站是？',
  '鐵道旅行，下一站是？',
  '隨機車站大放送！',
  '你的專屬目的地揭曉！',
  '旅途的驚喜是...',
  '下一站，你的未知旅程', // 新增標題
];


function App() {
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [randomStation, setRandomStation] = useState(null);
  // 控制「抽取結果」Modal 的狀態 (這個 Modal 保持在 App.jsx)
  const [isResultModalVisible, setIsResultModalVisible] = useState(false); // 重新命名狀態
  const [titleIndex, setTitleIndex] = useState(0); // 控制抽取結果 Modal 的標題索引

  // 處理縣市選擇變化，並重置結果 Modal
  const handleSelectionChange = (countyOrList) => {
    if (Array.isArray(countyOrList)) {
      setSelectedCounties(countyOrList);
    } else {
      const countyName = countyOrList;
      setSelectedCounties(prevSelected => {
        if (prevSelected.includes(countyName)) {
          return prevSelected.filter(c => c !== countyName);
        } else {
          return [...prevSelected, countyName];
        }
      });
    }
    setRandomStation(null); // 重置抽取結果
    setIsResultModalVisible(false); // 關閉結果 Modal
  };

  // 處理「抽取幸運車站！」按鈕點擊
  const handleRandomPick = () => {
    // 確保有選擇縣市才能抽取
    if (selectedCounties.length === 0) {
        console.warn("請至少選擇一個縣市！");
        return;
    }
    const station = getRandomStation(selectedCounties, stationsData); // 抽取車站
    setRandomStation(station);

    // 更新抽取結果 Modal 的標題索引，輪流顯示
    setTitleIndex(prevIndex => (prevIndex + 1) % modalTitles.length);

    // 顯示抽取結果 Modal
    setIsResultModalVisible(true);
  };

  // 關閉抽取結果 Modal
  const handleResultModalClose = () => { // 重新命名 handler
    setIsResultModalVisible(false);
  };

  // 判斷「抽取」按鈕是否禁用，根據選定的縣市數量
  const isPickButtonDisabled = selectedCounties.length === 0;


  return (
    // 使用 AppContainer 作為最外層佈局容器
    <AppContainer>
      {/* Sidebar 內容區域 */}
      <SidebarArea>
        {/* Sidebar 元件現在包含了所有 sidebar 相關的 UI 和按鈕 */}
        <Sidebar
          selectedCounties={selectedCounties}
          onChange={handleSelectionChange}
          traStationsData={stationsData} // 傳入車站資料給 Sidebar 顯示列表 (供 Info Modal 使用)
          // 將抽取 handler 和按鈕禁用狀態傳給 Sidebar 內部按鈕
          onRandomPick={handleRandomPick}
          isPickButtonDisabled={isPickButtonDisabled}
        />
      </SidebarArea>

      {/* 主要內容區域 (包含地圖和地圖上方的標題) */}
      <MainArea>
        {/* 主要內容區域的標題 */}
        <Title level={3} style={{ marginBottom: '24px', color: '#595959', textAlign: 'center' }}>
          點選地圖或勾選縣市來決定範圍
        </Title>
        {/* 地圖元件 */}
        <TaiwanSvgMap
          selectedCounties={selectedCounties}
          onMapClick={handleSelectionChange}
        />
        {/* ResultDisplay 元件現在只在 Modal 中顯示 */}
      </MainArea>

      {/* Modal 元件，用於顯示「抽取結果」 */}
      {/* 這個 Modal 保持在 App.jsx 中，因為它的狀態和觸發器 (randomStation, handleRandomPick) 在 App.jsx */}
      <Modal
        // 根據 titleIndex 顯示對應的標題
        title={<Title level={4} style={{ textAlign: 'center', margin: 0 }}>{modalTitles[titleIndex]}</Title>}
        // === 修正警告：將 visible 替換為 open ===
        open={isResultModalVisible} // 使用 App.jsx 的狀態
        onCancel={handleResultModalClose} // 使用 App.jsx 的 handler
        footer={null}
        centered // 讓 Modal 居中顯示
      >
        {/* Modal 的內容是 ResultDisplay 元件 */}
        {/* 傳遞 randomStation (最終結果) 和 stationsData (所有資料) 給 ResultDisplay */}
        {/* 確保只有當結果 Modal 顯示時才渲染 ResultDisplay 的內容，避免不必要的動畫或 Empty 狀態閃爍 */}
        {isResultModalVisible && (
             <ResultDisplay station={randomStation} allStationsData={stationsData} />
        )}
      </Modal>
    </AppContainer>
  );
}

export default App;