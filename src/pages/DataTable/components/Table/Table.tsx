// src/pages/Table.tsx
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import './Table.css';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import {LineChart} from "echarts/charts";
import {request} from "@umijs/max";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);
// 定义接口来描述数据类型
interface DataItem {
  [key: string]: any;
}

// 定义表格列的类型
const columns: ProColumns<DataItem>[] = [
  {
    title: '压延机1胶片宽度mm(接取处测量)',
    dataIndex: 'col1',
  },
  {
    title: '压延机1胶片宽度mm(贴合处测量)',
    dataIndex: 'col2',
  },
  {
    title: '压延机1主电机电流 A',
    dataIndex: 'col3',
  },
  {
    title: '压延机1速度 mpm',
    dataIndex: 'col4',
  },
  {
    title: '压延机1出胶温度 ℃',
    dataIndex: 'col5',
  },
  {
    title: '压延机1拉出辊速度 mpm',
    dataIndex: 'col6',
  },
  {
    title: '接取1运输带速度 mpm',
    dataIndex: 'col7',
  },
  {
    title: '压延机1修边刀实际刀间距 mm',
    dataIndex: 'col8',
  },
  {
    title: '压延机1上辊温控温度 ℃',
    dataIndex: 'col9',
  },
  {
    title: '压延机1下辊温控温度 ℃',
    dataIndex: 'col10',
  },
  {
    title: '挤出机1主电机电流 A',
    dataIndex: 'col11',
  },
  {
    title: '挤出机1速度 rpm',
    dataIndex: 'col12',
  },
  {
    title: '挤出机1机头压力 Mpa',
    dataIndex: 'col13',
  },
  {
    title: '挤出机1机头温度  ℃',
    dataIndex: 'col14',
  },
  {
    title: '挤出机1螺杆末端压力 Mpa',
    dataIndex: 'col15',
  },
  {
    title: '挤出机1机头温控温度 ℃',
    dataIndex: 'col16',
  },
  {
    title: '挤出机1塑化1温控温度 ℃',
    dataIndex: 'col17',
  },
  {
    title: '挤出机1塑化2温控温度 ℃',
    dataIndex: 'col18',
  },
  {
    title: '挤出机1机筒温控温度 ℃',
    dataIndex: 'col19',
  },
  {
    title: '挤出机1螺杆温控温度 ℃',
    dataIndex: 'col20',
  },
  {
    title: '操作侧测厚实际值',
    dataIndex: 'col21',
  },
  {
    title: '驱动侧测厚实际值',
    dataIndex: 'col22',
  },
  {
    title: '生产需要实际宽度',
    dataIndex: 'col23',
  },
  {
    title: '备用24',
    dataIndex: 'col24',
    hideInTable: true,
  },
  {
    title: '备用25',
    dataIndex: 'col25',
    hideInTable: true,
  },
  {
    title: '备用26',
    dataIndex: 'col26',
    hideInTable: true,
  },
  {
    title: '备用27',
    dataIndex: 'col27',
    hideInTable: true,
  },
  {
    title: '备用28',
    dataIndex: 'col28',
    hideInTable: true,
  },
  // 其他列的定义
  {
    title: '修间刀刀距',
    dataIndex: 'actualWidth',
  },
  {
    title: '胶片宽度预测值',
    dataIndex: 'predictedWidth',
  },
  {
    title: '时间',
    dataIndex: 'timestamp',
    valueType: 'time',
  },
];

const Table: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chart1Ref = useRef<HTMLDivElement | null>(null);
  const maxDataLength = 20;

  // 获取数据
  const fetchData = async () => {
    try {
      const result = await request("/api/getData");
      const newData: DataItem = {
        col1: result[0],
        col2: result[1],
        col3: result[2],
        col4: result[3],
        col5: result[4],
        col6: result[5],
        col7: result[6],
        col8: result[7],
        col9: result[8],
        col10: result[9],
        col11: result[10],
        col12: result[11],
        col13: result[12],
        col14: result[13],
        col15: result[14],
        col16: result[15],
        col17: result[16],
        col18: result[17],
        col19: result[18],
        col20: result[19],
        col21: result[20],
        col22: result[21],
        col23: result[22],
        actualWidth: result[28], // 假设这两个索引位置包含宽度数据
        predictedWidth: result[29],
        timestamp: result[30], // 假设最后一项为时间戳
      };
      setData((prevData) => {
        const updatedData = [newData, ...prevData];
        if (updatedData.length > maxDataLength) {
          updatedData.pop();
        }
        return updatedData;
      });
    } catch (error) {
      message.error('数据获取失败');
    }
  };

  // 初始化 Echarts 图表
  const initChart = () => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);
      const option = {
        title: {
          text: '生产需要宽度与胶片预测宽度'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          min: 498,  // 设置最小值，确保y轴刻度靠近数据范围
          max: 502,  // 设置最大值，缩小y轴的显示范围
        },
        series: [
          {
            name: '胶片预测宽度',
            type: 'line',
            showSymbol: false,
            data: data.map(item => [item.timestamp, item.predictedWidth]), // 格式化为时间-值对
          },
          {
            name: '生产需要实际宽度',
            type: 'line',
            showSymbol: false,
            data: data.map(item => [item.timestamp, item.col23]), // 格式化为时间-值对
          }
        ]
      };
      chartInstance.setOption(option);
      // return chartInstance;
    }
    if (chart1Ref.current) {
      const chart1Instance = echarts.init(chart1Ref.current);
      const option = {
        title: {
          text: '修间刀刀距'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          min: 500,  // 设置最小值，确保y轴刻度靠近数据范围
          max: 620,  // 设置最大值，缩小y轴的显示范围
        },
        series: [
          {
            name: '修间刀刀距',
            type: 'line',
            showSymbol: false,
            data: data.map(item => [item.timestamp, item.actualWidth]), // 格式化为时间-值对
          }
        ]
      };
      chart1Instance.setOption(option);
      // return chart1Instance;
    }
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    initChart();
    // return () => chartInstance?.dispose(); // 销毁图表实例
  }, [data]);

  return (
    <div>
      <ProTable<DataItem>
        columns={columns}
        dataSource={data}
        search={false}
        dateFormatter="string"
        headerTitle="胶片宽度预测和控制"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5'],
        }}
        className="custom-table"
      />
      <div style={{width: '100%', height: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop:10}} className="custom-table">
        <div ref={chartRef} style={{width: '50%', height: '400px', marginTop: '20px'}}/>
        <div ref={chart1Ref} style={{width: '50%', height: '400px', marginTop: '20px'}}/>
      </div>

    </div>
  );
};

export default Table;
