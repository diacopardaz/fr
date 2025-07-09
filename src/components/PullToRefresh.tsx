import React, { useState, useEffect } from 'react';
import { classNames } from '@plasmicapp/react-web';
import { CodeComponentMeta } from "@plasmicapp/host";

type PullToRefreshProps = {
  onRefresh?: () => void; // Optional function
};

export const PullToRefresh = (props: PullToRefreshProps) => {
  const { onRefresh } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullThreshold = 100;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchY - touchStartY;

      if (touchDiff > pullThreshold && window.scrollY === 0 && !isRefreshing) {
        setIsVisible(true);
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (isVisible) {
        setIsRefreshing(true);
        if (onRefresh) {
          onRefresh();
        }
        setTimeout(() => {
          setIsVisible(false);
          setIsRefreshing(false);
        }, 1000);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStartY, isRefreshing, isVisible, onRefresh]);

  return (
    <>
      <style>
        {`
          body {
            overscroll-behavior-y: auto;
          }
          .pull-to-refresh {
            position: fixed;
            top: -60px;
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            transition: top 0.3s ease-in-out;
            z-index: 1000;
          }
          .pull-to-refresh.visible {
            top: 0;
          }
          .spinner {
            width: 24px;
            height: 24px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #8254C6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className={classNames('pull-to-refresh', { visible: isVisible })}>
        <div className="spinner"></div>
      </div>
    </>
  );
};
export const PullToRefreshMeta: CodeComponentMeta<PullToRefreshProps> = {
  name: 'PullToRefresh',
  importPath: '@/components/PullToRefresh',
  props: {
    onRefresh: {
      type: 'eventHandler',
      argTypes: [],
    }
  },
};
