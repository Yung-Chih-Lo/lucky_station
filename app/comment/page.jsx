'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Typography, Form, Input, Button, Alert, Card, Tag, Divider, Spin, message
} from 'antd';
import { HomeOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';
import Link from 'next/link';
import CommentList from '../../components/CommentList';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function CommentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [pickInfo, setPickInfo] = useState(null); // { station_name, county, comment_used }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('缺少 token，請使用抽站後取得的連結。');
      return;
    }

    fetch(`/api/comments/${token}`)
      .then(res => {
        if (res.status === 404) throw new Error('invalid');
        return res.json();
      })
      .then(data => {
        setPickInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setError('無效的連結，請確認網址是否正確。');
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (trimmed.length < 10) {
      messageApi.warning('留言至少需要 10 個字');
      return;
    }
    if (trimmed.length > 500) {
      messageApi.warning('留言不能超過 500 個字');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/comments/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed, honeypot: '' }),
      });
      const data = await res.json();

      if (!res.ok) {
        messageApi.error(data.error || '送出失敗，請稍後再試。');
        return;
      }

      setSubmitted(true);
      // 2 秒後導向 /explore
      setTimeout(() => router.push('/explore'), 2000);
    } catch {
      messageApi.error('網路錯誤，請稍後再試。');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 16px' }}>
        <Alert type="error" message={error} showIcon />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/">回首頁抽站</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
      {contextHolder}

      <div style={{ marginBottom: 16 }}>
        <Link href="/" style={{ color: '#1890ff' }}>
          <HomeOutlined /> 回首頁
        </Link>
      </div>

      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        ✍️ 分享你的旅行心得
      </Title>

      {/* 車站資訊 */}
      <Card style={{ marginBottom: 24, textAlign: 'center' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>你抽到的車站</Text>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {pickInfo.station_name} 車站
        </Title>
        <Tag color="blue" style={{ marginTop: 8 }}>{pickInfo.county}</Tag>
      </Card>

      {/* 留言已使用 */}
      {pickInfo.comment_used ? (
        <Alert
          type="info"
          message="此連結已使用過"
          description="每個旅行連結只能留言一次。你可以到「旅人心得」頁面看看大家的故事。"
          showIcon
          action={
            <Button size="small" onClick={() => router.push('/explore')}>
              查看所有心得
            </Button>
          }
        />
      ) : submitted ? (
        <Alert
          type="success"
          message="留言已送出！正在跳轉到旅人心得頁面..."
          showIcon
        />
      ) : (
        /* 留言表單 */
        <Card title="寫下你的故事">
          {/* Honeypot（隱藏欄位，機器人防護） */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="旅行心得" required>
              <TextArea
                rows={6}
                placeholder="在這個車站，你遇到了什麼？看到了什麼？有什麼想分享給其他旅人的呢？（10 ~ 500 字）"
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={500}
                showCount
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SendOutlined />}
                block
                size="large"
              >
                送出心得
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* 同一車站其他人的留言 */}
      <Divider />
      <Title level={4} style={{ marginBottom: 16 }}>
        其他旅人在 {pickInfo.station_name} 的故事
      </Title>
      <CommentList stationFilter={pickInfo.station_name} />
    </div>
  );
}

export default function CommentPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 16px' }}><Spin size="large" /></div>}>
      <CommentPageContent />
    </Suspense>
  );
}
