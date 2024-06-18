import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Modal,
  message,
  Tag,
} from "antd";
import { useRouter } from "next/router";

import styles from "./index.module.css";

import dayjs from "dayjs";
import { deleteUser, getUserList, updateUser } from "../api/user";
import { UserQueryType, UserType } from "@/types";
import Content from "@/components/Content";
import { USER_STATUS } from "@/constant/user";

const STATUS_OPTIONS = [
  { label: "Enabled", value: USER_STATUS.ENABLED },
  { label: "Disabled", value: USER_STATUS.DISABLED },
];

const COLUMNS = [
  {
    title: "Account",
    dataIndex: "account",
    key: "account",
    width: 180,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 160,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) =>
      text === USER_STATUS.ENABLED ? (
        <Tag color="green">Enabled</Tag>
      ) : (
        <Tag color="red">Disabled</Tag>
      ),
  },
  {
    title: "Last Update Time",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 180,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

export default function User() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  });

  async function fetchData(values?: UserQueryType) {
    const res = await getUserList({
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

  const handleSearchFinish = async (values: UserQueryType) => {
    const res = await getUserList({
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

  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`);
  };

  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm to delete?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await deleteUser(id);
        message.success("User deleted successfully!");
        // 重新获取数据
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    // pagination获取的数据：已设置的pagination参数 + total参数（表示总数据量）
    setPagination(pagination); // 将新的pagination参数设置到pagination变量里
    const query = form.getFieldsValue();
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
    const { data } = res;
    setDataSource(data);
  };

  const handleStatusChange = async (row: UserType) => {
    const newStatus =
      row.status === USER_STATUS.ENABLED
        ? USER_STATUS.DISABLED
        : USER_STATUS.ENABLED; // 切换状态
    await updateUser(row._id, {
      status: newStatus,
    });
    // 重新获取数据
    fetchData(form.getFieldsValue());
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
                handleUserEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger={row.status === USER_STATUS.ENABLED}
              onClick={() => {
                handleStatusChange(row);
              }}
            >
              {row.status === USER_STATUS.ENABLED ? "Disable" : "Enable"}
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleUserDelete(row._id);
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
      title="User List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/user/add");
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
            <Form.Item name="status" label="Status">
              <Select
                placeholder="Please select"
                allowClear
                showSearch
                style={{ width: 150 }}
                options={STATUS_OPTIONS}
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
