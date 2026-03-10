'use client';

import React, { useState } from 'react';
import { Checkbox, Divider, Typography, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { mainIslandChineseCounties } from '../constants/mapConstants';

const { Text } = Typography;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
  }
`;

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

const AppTitle = styled.h2`
  margin: 0;
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const TrainIcon = styled.svg`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
`;

const SubtitleText = styled(Text)`
  display: block;
  margin-top: 6px;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: 0.85em;
  font-weight: 300;
`;

const TextWithInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  & > .ant-typography {
    margin-bottom: 0;
    margin-right: 8px;
    font-family: var(--font-body);
    color: var(--color-text);
    font-weight: 500;
  }

  & > .anticon {
    cursor: pointer;
    font-size: 16px;
    color: var(--color-primary);
    transition: color 0.2s;

    &:hover {
      color: var(--color-secondary);
    }
  }
`;

const ButtonGroup = styled.div`
  margin-top: 0;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

const SmallButton = styled.button`
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: #ccc;
    color: #ccc;
  }
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
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--color-text);
    cursor: pointer;
    transition: color 0.2s;

    span:last-child {
      display: inline-block;
      vertical-align: middle;
    }

    &:hover {
      color: var(--color-primary);
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .ant-checkbox-inner {
    border-radius: 4px;
    transition: all 0.2s;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
  border-color: rgba(14, 165, 233, 0.2);
`;

const MainButtonWrapper = styled.div`
  padding: 0;
  margin-top: auto;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: ${props => props.$active ? 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' : '#ccc'};
  border: none;
  border-radius: 12px;
  cursor: ${props => props.$active ? 'pointer' : 'not-allowed'};
  transition: all 0.25s ease;
  animation: ${props => props.$active ? pulse : 'none'} 2s ease-in-out infinite;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #EA6C00 0%, #F97316 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
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
        <AppTitle>
          <TrainIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="13" rx="2"/>
            <path d="M4 11h16"/>
            <path d="M12 3v8"/>
            <path d="M8 19l-2 3"/>
            <path d="M18 22l-2-3"/>
            <path d="M8 16h8"/>
          </TrainIcon>
          坐火行
        </AppTitle>
        <SubtitleText>每一次出發，都是新的故事</SubtitleText>
      </TitleContainer>

      <TextWithInfo>
        <Text strong>選擇想去的縣市：</Text>
        <InfoCircleOutlined onClick={() => setIsInfoModalVisible(true)} />
      </TextWithInfo>

      <ButtonGroup>
        <SmallButton onClick={handleSelectAll} disabled={isSelectAllDisabled}>
          全選
        </SmallButton>
        <SmallButton onClick={handleDeselectAll} disabled={isDeselectAllDisabled}>
          全部取消
        </SmallButton>
      </ButtonGroup>

      <CheckboxGroupWrapper
        options={displayCounties.map(county => ({ label: county, value: county }))}
        value={selectedCounties}
        onChange={handleGroupChange}
      />

      <StyledDivider />

      <MainButtonWrapper>
        <CTAButton
          onClick={!isPickButtonDisabled ? onRandomPick : undefined}
          $active={!isPickButtonDisabled}
          disabled={isPickButtonDisabled}
        >
          抽取幸運車站！
        </CTAButton>
      </MainButtonWrapper>

      <Modal
        title={<span style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>各縣市台鐵車站列表</span>}
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={null}
        width={600}
        styles={{ body: { maxHeight: '60vh', overflowY: 'auto' } }}
      >
        {Object.entries(traStationsData ?? {}).map(([county, stations]) => (
          <div key={county} style={{ marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
            <Text strong style={{ color: 'var(--color-text)' }}>{county}:</Text>
            <br />
            <span style={{ color: 'var(--color-text-muted)' }}>{stations.join('、')}</span>
          </div>
        ))}
      </Modal>
    </SidebarWrapper>
  );
}

export default Sidebar;
