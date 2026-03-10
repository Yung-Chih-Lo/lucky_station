'use client';

import React from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Btn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 24px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(14, 165, 233, 0.35);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.12);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  animation: ${slideIn} 0.4s ease both;

  .arrow {
    transition: transform 0.2s ease;
  }

  &:hover {
    background: var(--color-primary);
    color: #fff;
    box-shadow: 0 4px 18px rgba(14, 165, 233, 0.35);
    border-color: transparent;

    .arrow {
      transform: translateX(-4px);
    }
  }
`;

const Wrapper = styled.div`
  position: sticky;
  top: 16px;
  z-index: 10;
  margin-bottom: 24px;
`;

export default function BackButton({ href = '/', label = '回首頁' }) {
  return (
    <Wrapper>
      <Btn href={href}>
        <svg className="arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        {label}
      </Btn>
    </Wrapper>
  );
}
