import { useState, useEffect, useCallback } from 'react';

// 实时成本数据
export interface RealtimeCostData {
  timestamp: string;
  cost: number;
  resourcesCount: number;
  cloudType: string;
}

// WebSocket 状态
export interface WebSocketStatus {
  connected: boolean;
  error: string | null;
}

/**
 * 实时成本监控 Hook
 * @returns 实时数据和 WebSocket 状态
 */
export const useRealtimeCost = (): {
  data: RealtimeCostData[];
  status: WebSocketStatus;
  connect: () => void;
  disconnect: () => void;
} => {
  const [data, setData] = useState<RealtimeCostData[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  let ws: WebSocket | null = null;

  const connect = useCallback(() => {
    try {
      // 模拟 WebSocket 连接
      // 实际应该使用 WebSocket API
      ws = new WebSocket('ws://localhost:8080/cost-realtime');
      
      ws.onopen = () => {
        setConnected(true);
        setError(null);
        console.log('WebSocket connected for cost monitoring');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleNewData(message);
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('WebSocket disconnected');
        // 3秒后重连
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        setConnected(false);
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      setError('Failed to connect to WebSocket');
      setConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      ws = null;
    }
    setConnected(false);
  }, []);

  const handleNewData = useCallback((newData: RealtimeCostData) => {
    setData(prevData => {
      const updatedData = [...prevData, newData];
      // 保持最近 100 条数据
      if (updatedData.length > 100) {
        return updatedData.slice(-100);
      }
      return updatedData;
    });
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    data,
    status: { connected, error },
    connect,
    disconnect,
  };
};
