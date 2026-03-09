import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import StyledRegistry from '../components/StyledRegistry';
import './globals.css';

export const metadata = {
  title: '坐火行 — 台鐵隨機車站抽取器',
  description: '隨機抽取台灣台鐵車站，探索未知的旅行目的地。分享你的旅行心得，看看其他旅人的故事。',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>
        <AntdRegistry>
          <StyledRegistry>
            {children}
          </StyledRegistry>
        </AntdRegistry>
      </body>
    </html>
  );
}
