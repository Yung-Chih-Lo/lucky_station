'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Select, Pagination, Card, Tag, Typography, Empty, Spin, Space } from 'antd';
import { SearchOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;
const { Search } = Input;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const CommentCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  }
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentList({ initialComments, initialTotal, stationFilter }) {
  const [comments, setComments] = useState(initialComments || []);
  const [total, setTotal] = useState(initialTotal || 0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [station, setStation] = useState(stationFilter || '');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async (p, s, st) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: '10',
        ...(s ? { search: s } : {}),
        ...(st ? { station: st } : {}),
      });
      const res = await fetch(`/api/comments?${params}`);
      const data = await res.json();
      setComments(data.comments || []);
      setTotal(data.total || 0);
    } catch {
      // 保持現有資料
    } finally {
      setLoading(false);
    }
  }, []);

  // 當 search 或 station 改變時回到第一頁
  useEffect(() => {
    setPage(1);
    fetchComments(1, search, station);
  }, [search, station, fetchComments]);

  const handlePageChange = (p) => {
    setPage(p);
    fetchComments(p, search, station);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <FilterBar>
        <Search
          placeholder="搜尋留言內容..."
          allowClear
          style={{ width: 240 }}
          prefix={<SearchOutlined />}
          onSearch={(v) => setSearch(v)}
          onChange={(e) => !e.target.value && setSearch('')}
        />
        <Select
          placeholder="篩選車站"
          allowClear
          style={{ width: 160 }}
          value={station || undefined}
          onChange={(v) => setStation(v || '')}
          showSearch
          options={
            // 從現有留言取得車站清單（簡化做法）
            [...new Set([...comments.map(c => c.station_name)])]
              .map(s => ({ label: s, value: s }))
          }
        />
        <Text type="secondary">共 {total} 則心得</Text>
      </FilterBar>

      <Spin spinning={loading}>
        {comments.length === 0 ? (
          <Empty description="還沒有留言，快去旅行分享你的故事！" />
        ) : (
          comments.map(comment => (
            <CommentCard key={comment.id}>
              <CardMeta>
                <Tag color="blue" icon={<EnvironmentOutlined />}>
                  {comment.station_name} 車站
                </Tag>
                <Tag>{comment.county}</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {formatDate(comment.created_at)}
                </Text>
              </CardMeta>
              <Paragraph
                style={{ margin: 0, whiteSpace: 'pre-wrap' }}
                ellipsis={{ rows: 4, expandable: true, symbol: '展開全文' }}
              >
                {comment.content}
              </Paragraph>
            </CommentCard>
          ))
        )}
      </Spin>

      {total > 10 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Pagination
            current={page}
            total={total}
            pageSize={10}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
