import { useState, useEffect } from 'react';
import { linearRegression, predictValues, calculateConfidenceInterval } from 'utils/costPrediction';

// 成本数据点
interface CostDataPoint {
  date: string;
  cost: number;
}

// 预测数据
interface PredictedCostData {
  date: string;
  actualCost: number;
  predictedCost: number;
  lowerBound: number;
  upperBound: number;
}

// 预测结果
export interface CostPredictionResult {
  data: PredictedCostData[];
  loading: boolean;
  error: string | null;
}

/**
 * 成本预测 Hook
 * @param dataSourceId 数据源 ID
 * @param daysBack 回溯天数
 * @returns 预测数据和状态
 */
export const useCostPrediction = (
  dataSourceId: string,
  daysBack: number = 30
): CostPredictionResult => {
  const [data, setData] = useState<PredictedCostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataSourceId) {
      setError('No data source selected');
      setLoading(false);
      return;
    }

    // 模拟 API 调用
    // 实际应该调用 GraphQL 查询
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 模拟获取历史成本数据
        const historicalData: CostDataPoint[] = generateMockCostData(daysBack);
        
        // 进行预测
        const predictions = calculateCostPrediction(historicalData);
        
        setData(predictions);
        setError(null);
      } catch (err) {
        setError('Failed to calculate cost prediction');
        console.error('Cost prediction error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSourceId, daysBack]);

  return { data, loading, error };
};

/**
 * 生成模拟成本数据
 * @param daysBack 回溯天数
 * @returns 成本数据数组
 */
const generateMockCostData = (daysBack: number): CostDataPoint[] => {
  const data: CostDataPoint[] = [];
  const today = new Date();
  
  // 基础成本和趋势
  const baseCost = 1000;
  const dailyTrend = 5; // 每天增加 5 美元
  
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 添加一些随机波动
    const randomFactor = 0.8 + Math.random() * 0.4;
    const cost = (baseCost + dailyTrend * (daysBack - i)) * randomFactor;
    
    data.push({
      date: date.toISOString().split('T')[0],
      cost: Math.round(cost * 100) / 100,
    });
  }
  
  return data;
};

/**
 * 计算成本预测
 * @param historicalData 历史成本数据
 * @returns 预测数据数组
 */
const calculateCostPrediction = (historicalData: CostDataPoint[]): PredictedCostData[] => {
  if (historicalData.length < 2) {
    return historicalData.map(item => ({
      date: item.date,
      actualCost: item.cost,
      predictedCost: item.cost,
      lowerBound: item.cost * 0.8,
      upperBound: item.cost * 1.2,
    }));
  }

  // 准备线性回归数据
  const regressionData = historicalData.map((item, index) => ({
    x: index,
    y: item.cost,
  }));

  // 计算线性回归
  const { slope, intercept } = linearRegression(regressionData);

  // 预测未来 7 天
  const predictions: PredictedCostData[] = [];
  
  // 添加历史数据
  historicalData.forEach((item, index) => {
    predictions.push({
      date: item.date,
      actualCost: item.cost,
      predictedCost: slope * index + intercept,
      lowerBound: item.cost * 0.8,
      upperBound: item.cost * 1.2,
    });
  });

  // 添加预测数据
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  for (let i = 1; i <= 7; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i);
    
    const predictedValue = slope * (historicalData.length + i - 1) + intercept;
    const confidenceInterval = predictedValue * 0.15;

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      actualCost: 0,
      predictedCost: Math.max(0, predictedValue),
      lowerBound: Math.max(0, predictedValue - confidenceInterval),
      upperBound: predictedValue + confidenceInterval,
    });
  }

  return predictions;
};
