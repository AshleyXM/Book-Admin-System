import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import { useRouter } from "next/router";

import styles from "./index.module.css";

import dayjs from "dayjs";
import { deleteCategory, getCategoryList } from "../api/category";
import { CategoryQueryType, CategoryType } from "@/types";
import Content from "@/components/Content";

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 180,
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    width: 130,
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>{`Level ${text}`}</Tag>;
    },
  },
  {
    title: "Parent Level",
    dataIndex: "parent",
    key: "parentLevel",
    width: 180,
    render: (text: { name: string }) => {
      return text?.name ?? "-";
    },
  },
  {
    title: "Last Update Time",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 180,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

enum LEVEL {
  ONE = 1,
  TWO = 2,
}

export const LEVEL_OPTIONS = [
  { label: "Level 1", value: LEVEL.ONE },
  { label: "Level 2", value: LEVEL.TWO },
];

export default function Category() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  });

  async function fetchData(values?: any) {
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    });
    const { data } = res;
    setDataSource(data);
    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
  }, []); // dependency array必须设置为空数组，表示只在mount的时候运行一次

  const handleSearchFinish = async (values: CategoryQueryType) => {
    const res = await getCategoryList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    setDataSource(res.data);
    // 注意total不能设置成res.data.length，因为res.data只是分页的数据，并不是总的数据
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchClear = () => {
    console.log(form);
    // 清空需要拿到表单示例，将表单的几个field清空
    form.resetFields();
  };

  const handleCategoryEdit = (id: string) => {
    router.push(`/category/edit/${id}`);
  };

  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm to delete?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        // 删除指定的category
        await deleteCategory(id);
        message.success("Category deleted successfully!");
        // 重新获取数据
        fetchData(form.getFieldsValue()); // 按照搜索框的条件过滤
      },
    });
  };

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    // pagination获取的数据：已设置的pagination参数 + total参数（表示总数据量）
    setPagination(pagination); // 将新的pagination参数设置到pagination变量里
    const query = form.getFieldsValue();
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
    const { data } = res;
    setDataSource(data);
  };

  const columns = [
    ...COLUMNS,
    {
      title: "Action",
      key: "action",
      render: (_: any, row: any) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                handleCategoryEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleCategoryDelete(row._id);
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Content
      title="Category List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/category/add");
          }}
        >
          Add
        </Button>
      }
    >
      <Form
        name="search"
        form={form}
        onFinish={handleSearchFinish}
        initialValues={{
          name: "",
          author: "",
          category: [],
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="Name">
              <Input placeholder="Please enter" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="level" label="Level">
              <Select
                placeholder="Please select"
                allowClear
                showSearch
                style={{ width: 150 }}
                options={LEVEL_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button type="primary" onClick={handleSearchClear}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrapper}>
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showTotal: () => `Total ${pagination.total} records`,
          }}
        />
      </div>
    </Content>
  );
}
