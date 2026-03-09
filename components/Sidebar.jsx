'use client';

import React, { useState } from 'react';
import { Checkbox, Button, Divider, Typography, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { mainIslandChineseCounties } from '../constants/mapConstants';

const { Text, Title } = Typography;

const SidebarWrapper = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const SubtitleText = styled(Text)`
  display: block;
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.9em;
`;

const TextWithInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

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

const ButtonGroup = styled.div`
  margin-top: 0;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

const CheckboxGroupWrapper = styled(Checkbox.Group)`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px 12px;
  align-content: start;

  .ant-checkbox-wrapper {
    margin-bottom: 0;
    span:last-child {
      display: inline-block;
      vertical-align: middle;
    }
  }
`;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
`;

const MainButtonWrapper = styled.div`
  padding: 0;
  margin-top: auto;
`;

function Sidebar({ selectedCounties = [], onChange, traStationsData = {}, onRandomPick, isPickButtonDisabled }) {
  const displayCounties = mainIslandChineseCounties;
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  const handleSelectAll = () => onChange(displayCounties);
  const handleDeselectAll = () => onChange([]);
  const handleGroupChange = (checkedValues) => onChange(checkedValues);

  const isSelectAllDisabled = selectedCounties.length === displayCounties.length;
  const isDeselectAllDisabled = selectedCounties.length === 0;

  return (
    <SidebarWrapper>
      <TitleContainer>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          坐火行 (chò-hué kiânn) 🚆
        </Title>
        <SubtitleText>每一次出發，都是新的故事</SubtitleText>
      </TitleContainer>

      <TextWithInfo>
        <Text strong>選擇想去的縣市：</Text>
        <InfoCircleOutlined onClick={() => setIsInfoModalVisible(true)} />
      </TextWithInfo>

      <ButtonGroup>
        <Button type="link" size="small" onClick={handleSelectAll} disabled={isSelectAllDisabled}>
          全選
        </Button>
        <Button type="link" size="small" onClick={handleDeselectAll} disabled={isDeselectAllDisabled}>
          全部取消
        </Button>
      </ButtonGroup>

      <CheckboxGroupWrapper
        options={displayCounties.map(county => ({ label: county, value: county }))}
        value={selectedCounties}
        onChange={handleGroupChange}
      />

      <StyledDivider />

      <MainButtonWrapper>
        <Button
          type="primary"
          block
          size="large"
          onClick={onRandomPick}
          disabled={isPickButtonDisabled}
        >
          抽取幸運車站！
        </Button>
      </MainButtonWrapper>

      <Modal
        title="各縣市台鐵車站列表"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
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
