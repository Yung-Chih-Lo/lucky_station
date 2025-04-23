// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Checkbox, Button, Divider, Typography, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { mainIslandChineseCounties } from '../constants/mapConstants';

const { Text, Title } = Typography;

// 保持 SidebarWrapper 的基本 flex 設定，使其成為一個 Flex 容器
const SidebarWrapper = styled.div`
  padding: 16px; // 保持整體內邊距
  height: 100%; // 讓內容填滿父容器高度 (SidebarArea)
  display: flex;
  flex-direction: column; // 子元素垂直排列
  // background-color: #f8f8f8; // 可選：增加一個背景色讓 Sidebar 更獨立
`;

// 標題區塊容器，包含主標題和副標題
const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 24px; // 標題區塊與下方內容的間距
`;

// 副標題樣式
const SubtitleText = styled(Text)`
  display: block; // 讓副標題獨佔一行
  margin-top: 4px; // 副標題與主標題的間距
  color: rgba(0, 0, 0, 0.55); // 使用 antd 的 secondary text 顏色，更柔和
  font-size: 0.9em; // 副標題字體可以小一點
`;

// "選擇縣市" 文字和資訊圖標容器
const TextWithInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px; // 與下方按鈕區塊的間距

    & > .ant-typography {
        margin-bottom: 0;
        margin-right: 8px;
    }

    & > .anticon {
        cursor: pointer;
        font-size: 16px;
        color: #1890ff;
    }
`;

// 全選/全部取消按鈕區塊
const ButtonGroup = styled.div`
  margin-top: 0;
  margin-bottom: 16px; // 按鈕區塊與下方 Checkbox 的間距
  display: flex;
  justify-content: space-between;
  padding: 0 8px; // 按鈕左右可以有點內縮
`;

// Checkbox 群組容器
const CheckboxGroupWrapper = styled(Checkbox.Group)`
  flex-grow: 1; // 讓 Checkbox 區域填滿中間剩餘空間，將 Footer 推到底部
  overflow-y: auto; // 如果內容超出則滾動
  padding-right: 8px; // 為了讓滾動條不貼著邊緣，或讓內容右側有點空間

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px 12px;
  align-content: start;
  // margin-bottom 的間距由下方的 StyledDivider 控制

  .ant-checkbox-wrapper {
    margin-bottom: 0;
    span:last-child {
        display: inline-block;
        vertical-align: middle;
    }
  }
`;

// 底部的 Divider
const StyledDivider = styled(Divider)`
    margin: 16px 0; // Divider 上下間距
`;

// 包裹主抽取按鈕的容器，使用 margin-top: auto 將其推到底部
const MainButtonWrapper = styled.div`
    padding: 0 0 0; // 按鈕的內邊距由 SidebarWrapper 的 padding 控制
    margin-top: auto; // 利用 Flexbox 的特性，將此容器推到 SidebarWrapper 的最下方
`;


// Sidebar 元件需要接收按鈕相關的 props
function Sidebar({ selectedCounties = [], onChange, traStationsData = {}, onRandomPick, isPickButtonDisabled }) { // 接收新的 props
  const displayCounties = mainIslandChineseCounties;

  // === 修正錯誤：將 handleSelectAll 和 handleDeselectAll 定義回 Sidebar 內部 ===
  const handleSelectAll = () => {
    // 這兩個函數的邏輯是正確的，並且使用 onChange 更新父元件狀態
    onChange(displayCounties);
  };

  const handleDeselectAll = () => {
    // 這兩個函數的邏輯是正確的，並且使用 onChange 更新父元件狀態
    onChange([]);
  };
  // ======================================================================

  const handleGroupChange = (checkedValues) => {
    onChange(checkedValues);
  };

  // 控制「各縣市台鐵車站列表」Modal 的狀態 (這個 Modal 保持在 Sidebar 內部)
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // 重新命名狀態避免與 App.jsx 的 Modal 混淆

  const showInfoModal = () => { // 重新命名 handler
    setIsInfoModalVisible(true);
  };

  const handleInfoModalClose = () => { // 重新命名 handler
    setIsInfoModalVisible(false);
  };

  // 全選/取消按鈕的禁用狀態邏輯保留在 Sidebar 內部
   const isSelectAllDisabled = selectedCounties.length === displayCounties.length;
   const isDeselectAllDisabled = selectedCounties.length === 0;


  return (
    <SidebarWrapper>
      {/* 標題區塊 */}
      <TitleContainer>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          坐火行 (chò-hué kiânn) 🚆
        </Title>
        {/* 副標題 */}
        <SubtitleText>每一次出發，都是新的故事</SubtitleText>
      </TitleContainer>

      {/* 選擇縣市文字與資訊圖標 */}
      <TextWithInfo>
          <Text strong>選擇想去的縣市：</Text>
          {/* 點擊圖標觸發顯示各縣市車站列表的 Modal */}
          <InfoCircleOutlined onClick={showInfoModal} />
      </TextWithInfo>

      {/* 全選/取消按鈕 */}
      <ButtonGroup>
        {/* 點擊事件使用 Sidebar 內部的 handler */}
        <Button type="link" size="small" onClick={handleSelectAll} disabled={isSelectAllDisabled}>
          全選
        </Button>
        {/* 點擊事件使用 Sidebar 內部的 handler */}
        <Button type="link" size="small" onClick={handleDeselectAll} disabled={isDeselectAllDisabled}>
          全部取消
        </Button>
      </ButtonGroup>

      {/* 縣市選擇 Checkbox */}
      <CheckboxGroupWrapper
        options={displayCounties.map(county => ({ label: county, value: county }))}
        value={selectedCounties}
        onChange={handleGroupChange}
      />

      {/* 分隔線 (在 Checkbox 列表和按鈕之間) */}
      <StyledDivider />

      {/* 主抽取按鈕 (移入 Sidebar 並推到底部) */}
      <MainButtonWrapper>
         <Button
            type="primary"
            block
            size="large"
            onClick={onRandomPick} // 使用從父元件 App 傳入的 handler
            disabled={isPickButtonDisabled} // 使用從父元件 App 傳入的 disabled 狀態
          >
            抽取幸運車站！
          </Button>
      </MainButtonWrapper>


      {/* Modal for station list info (保持在這裡，由 Sidebar 內部狀態控制) */}
      <Modal
         title="各縣市台鐵車站列表"
         // === 修正警告：將 visible 替換為 open ===
         open={isInfoModalVisible} // 使用 Sidebar 內部的狀態
         onCancel={handleInfoModalClose} // 使用 Sidebar 內部的 handler
         footer={null}
         width={600}
      >
        {Object.entries(traStationsData).map(([county, stations]) => (
          <div key={county} style={{ marginBottom: '12px' }}>
            <Text strong>{county}:</Text>
            <br />
            {stations.join('、')}
          </div>
        ))}
      </Modal>
    </SidebarWrapper>
  );
}

export default Sidebar;