'use client';

import React from 'react';
import { Typography } from 'antd';
import BackButton from '../../components/BackButton';
import CommentList from '../../components/CommentList';

const { Title, Text } = Typography;

export default function ExplorePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <BackButton />

      <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
        💬 旅人心得
      </Title>
      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
        每一段旅程都值得被記錄，每一個車站都有屬於它的故事
      </Text>

      <CommentList />
    </div>
  );
}
