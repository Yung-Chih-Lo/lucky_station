'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Table, Tag, Spin } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import BackButton from '../../components/BackButton';

const { Title, Text } = Typography;

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function StatsPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats?limit=100')
      .then(res => res.json())
      .then(data => setRankings(data.rankings || []))
      .finally(() => setLoading(false));
  }, []);

  const totalPicks = rankings.reduce((sum, r) => sum + r.pick_count, 0);

  const columns = [
    {
      title: '名次',
      key: 'rank',
      width: 70,
      render: (_, record) => {
        const rank = record.globalRank;
        if (rank < 3) {
          return <TrophyOutlined style={{ color: medalColors[rank], fontSize: 20 }} />;
        }
        return <Text type="secondary">{rank + 1}</Text>;
      },
    },
    {
      title: '車站',
      dataIndex: 'station_name',
      key: 'station_name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: '縣市',
      dataIndex: 'county',
      key: 'county',
      render: (county) => <Tag color="blue">{county}</Tag>,
    },
    {
      title: '被抽次數',
      dataIndex: 'pick_count',
      key: 'pick_count',
      render: (count) => (
        <Text style={{ color: '#1890ff', fontWeight: 600 }}>
          {count.toLocaleString()} 次
        </Text>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <BackButton />

      <Title level={2} style={{ textAlign: 'center', marginBottom: 8 }}>
        🏆 抽站排行榜
      </Title>
      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
        累計 {totalPicks.toLocaleString()} 次抽站紀錄
      </Text>

      <Spin spinning={loading}>
        {!loading && rankings.length === 0 ? (
          <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
            還沒有抽站記錄，快回首頁抽第一站吧！
          </Text>
        ) : (
          <Table
            dataSource={rankings.map((r, i) => ({ ...r, key: i, globalRank: i }))}
            columns={columns}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            size="middle"
          />
        )}
      </Spin>
    </div>
  );
}
