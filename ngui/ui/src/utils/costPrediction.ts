/**
 * 成本预测工具函数
 */

// 线性回归数据点
interface DataPoint {
  x: number;
  y: number;
}

// 预测结果
export interface PredictionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

/**
 * 计算线性回归
 * @param data 数据点数组
 * @returns 回归系数和决定系数
 */
export const linearRegression = (data: DataPoint[]): PredictionResult => {
  const n = data.length;
  
  if (n < 2) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const sumX = data.reduce((acc, p) => acc + p.x, 0);
  const sumY = data.reduce((acc, p) => acc + p.y, 0);
  const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumXX = data.reduce((acc, p) => acc + p.x * p.x, 0);
  const sumYY = data.reduce((acc, p) => acc + p.y * p.y, 0);

  // 计算斜率和截距
  const numerator = n * sumXY - sumX * sumY;
  const denominator = n * sumXX - sumX * sumX;
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;

  // 计算决定系数 R²
  const ssTot = sumYY - (sumY * sumY) / n;
  const ssRes = sumYY - intercept * sumY - slope * sumXY;
  const rSquared = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, rSquared };
};

/**
 * 预测未来值
 * @param slope 斜率
 * @param intercept 截距
 * @param xValues 要预测的 x 值数组
 * @returns 预测值数组
 */
export const predictValues = (slope: number, intercept: number, xValues: number[]): number[] => {
  return xValues.map(x => Math.max(0, slope * x + intercept));
};

/**
 * 计算置信区间
 * @param predictedValues 预测值数组
 * @param confidenceLevel 置信水平 (0.95 表示 95%)
 * @returns 置信区间数组
 */
export const calculateConfidenceInterval = (
  predictedValues: number[], 
  confidenceLevel: number = 0.95
): { lower: number; upper: number }[] => {
  // 简化的置信区间计算（实际应该使用标准误差）
  const marginOfError = confidenceLevel === 0.95 ? 0.15 : 0.25; // 95% 置信水平使用 15% 误差
  
  return predictedValues.map(value => ({
    lower: Math.max(0, value * (1 - marginOfError)),
    upper: value * (1 + marginOfError),
  }));
};
