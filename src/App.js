import React, { useEffect, useState } from "react";
import { Pie, Column } from "@ant-design/charts";
import { useSelector, useDispatch } from "react-redux";
import { getChartData, setChartData } from "./reducers/chartReducer";
import { Layout, Image, PageHeader, Card, Spin, BackTop, Button, Modal, Form, Input, Radio } from "antd";
import logo from "./logo.svg";

const App = () => {
  const { Header, Footer, Content } = Layout;
  const [editingChart, setEditingChart] = useState(null);

  const dispatch = useDispatch();
  const chartData = useSelector((state) => state.charts.chartsData);

  // Fetch initial chart data
  useEffect(() => {
    fetch("https://s3-ap-southeast-1.amazonaws.com/he-public-data/chart2986176.json")
      .then((r) => r.json())
      .then((data) => {
        const chartData = data.map((chart, index) => ({
          ...chart,
          index,
          key: "chart" + index,
          elements: chart.elements.map((el, i) => ({ value: el, type: "Category " + (i + 1) })),
        }));
        dispatch(getChartData(chartData));
      })
      .catch(console.log);
  }, [dispatch]);

  // Chart Configs
  const pieConfigs = { angleField: "value", colorField: "type", label: { type: "outer" } };
  const barConfigs = {
    xField: "type",
    yField: "value",
    label: { position: "middle", style: { fill: "#FFFFFF", opacity: 0.6 } },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { type: { alias: "Category" }, value: { alias: "Value" } },
  };

  // Chart Editing
  const type = editingChart ? editingChart.type : "Pie";
  const values = editingChart ? editingChart.elements.map((el) => el.value).join(",") : "";

  const onSubmit = (data) => {
    const allData = chartData;
    const { index, key } = editingChart;
    const values = data.values.split(",").reduce((values, el) => {
      const value = parseInt(el);
      return value && !isNaN(value) ? [...values, value] : values;
    }, []);
    const elements = values.map((value, i) => ({ value, type: "Category " + (i + 1) }));
    const editedItem = { type: data.type, elements, index, key };
    const latestData = allData.map((oldItem, ind) => (ind === index ? editedItem : oldItem));

    dispatch(setChartData(latestData));
    setEditingChart(null);
  };

  return (
    <Layout>
      <Header>
        <Image src={logo} className='app-logo' alt='logo' preview={false} />
      </Header>
      <Content>
        <BackTop />

        <PageHeader
          title='Charts Dashboard'
          extra={[
            <Button type='primary' href='/' key='refresh'>
              Refresh
            </Button>,
          ]}
        >
          {chartData.length === 0 && <Spin tip='Please Wait...' />}

          {chartData.map((chartD) => (
            <Card
              key={chartD.key}
              title={`Chart ${chartD.index + 1} - ${chartD.type} Chart`}
              extra={[
                <Button key='edit-data' onClick={() => setEditingChart(chartD)}>
                  Edit Data
                </Button>,
              ]}
            >
              {chartD.type === "Pie" ? (
                <Pie {...{ ...pieConfigs, data: chartD.elements }} />
              ) : (
                <Column {...{ ...barConfigs, data: chartD.elements }} />
              )}
            </Card>
          ))}
        </PageHeader>

        <Modal
          footer={null}
          visible={editingChart}
          onCancel={() => setEditingChart(null)}
          title={"Edit Chart " + (editingChart ? editingChart.index + 1 : "")}
        >
          <Form
            layout='horizontal'
            onFinish={onSubmit}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ type, values }}
          >
            <Form.Item label='Type' name='type'>
              <Radio.Group value={type}>
                <Radio.Button value='Pie'>Pie</Radio.Button>
                <Radio.Button value='Bar'>Bar</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label='Values' name='values'>
              <Input />
            </Form.Item>
            <Form.Item style={{ marginLeft: "16.66666667%", marginBottom: 0, top: -25, position: "relative" }}>
              <span style={{ color: "red" }}>Please put comma separated values.</span>
            </Form.Item>

            <Form.Item style={{ marginLeft: "16.66666667%" }}>
              <Button type='primary' htmlType='submit'>
                Update Data
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
      <Footer>Copyright {new Date().getFullYear()} Clootrack. All Right Reserved.</Footer>
    </Layout>
  );
};

export default App;
