import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Divider, Form, List, message} from 'antd';
import {
  getInterfaceInfoByIdUsingGet, invokeInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet
} from "@/services/fengapi-backend/interfaceInfoController";
import {useMatch, useParams} from "@@/exports";
import TextArea from "antd/es/input/TextArea";
import {FormProps} from "antd/lib";


/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */

const Index: React.FC = () => {
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 列表数据
  const [data, setData] = useState<API.InterfaceInfo>([]);
  // 总数
  const [total, setTotal] = useState<number>(0);

  //存储结果变量
  const [invokeRes, setInvokeRes] = useState<any>();

  // 加载状态，默认为false
  const [invokeLoading, setInvokeLoading] = useState(false);


  // 使用 useParams 钩子函数获取动态路由参数
  const params = useParams();

  // 定义异步加载数据的函数
  const loadData = async () => {
    // 检查动态路由参数是否存在
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      // 发起请求获取接口信息，接受一个包含 id 参数的对象作为参数
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      // 将获取到的接口信息设置到 data 状态中
      setData(res.data);
    } catch (error: any) {
      // 请求失败处理
      message.error('请求失败，' + error.message);
    }
    // 请求完成，设置 loading 状态为 false，表示请求结束，可以停止加载状态的显示
    setLoading(false);
  };

  useEffect(() => {
    // 页面加载完成后调用加载数据的函数
    loadData();
  }, []);

  const onFinish = async (values: any) => {
    // 检查是否存在接口id
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    // 显示正加载中状态
    setInvokeLoading(true);
    try {
      // 发起接口调用请求，传入一个对象作为参数，这个对象包含了id和values的属性，
      // 其中，id 是从 params 中获取的，而 values 是函数的参数
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    // 关闭正加载中状态
    setInvokeLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        { data ?
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status === 1 ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions> : (<>接口不存在</>)
        }
      </Card>
      <Divider/>
      <Card title="在线测试" >
        <Form
          name="invoke"
          layout="vertical" //布局方式为垂直布局
          onFinish={onFinish}
        >
          <Form.Item
            label="请求参数"
            name="userRequestParams"
          >
            <TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>

  );
};

export default Index;
