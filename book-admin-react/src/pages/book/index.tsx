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
  Image,
  Tooltip,
  Modal,
  message,
} from "antd";
import { useRouter } from "next/router";

import styles from "./index.module.css";

import dayjs from "dayjs";
import { deleteBook, getBookList } from "../api/book";
import { BookQueryType, CategoryType } from "@/types";
import Content from "@/components/Content";
import { getCategoryList } from "../api/category";

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "Cover",
    dataIndex: "cover",
    key: "cover",
    width: 120,
    render: (url: string) => {
      return <Image src={url} width={100} height={100} />;
    },
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    width: 120,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 100,
    render: (text: { name: string }) => {
      return text?.name;
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 140,
    ellipsis: true,
    render: (text: string) => {
      return (
        <Tooltip title={text} placement="topLeft">
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    width: 80,
  },
  {
    title: "Publication Date",
    dataIndex: "publishedAt",
    key: "publishedAt",
    width: 140,
    render: (text: number) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "Last Update Time",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 160,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

export default function Book() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  });

  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  async function fetchData(values?: BookQueryType) {
    const res = await getBookList({
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
    // 获取搜索栏category的下拉填充项
    getCategoryList({ all: true }).then((res) => {
      // 使用then链式调用写法更简单，但对于复杂的异步逻辑会降低代码可读性
      setCategoryList(res.data);
    });
  }, []); // dependency array必须设置为空数组，表示只在mount的时候运行一次

  const handleSearchFinish = async (values: BookQueryType) => {
    const res = await getBookList({
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

  const handleBookEdit = (id: string) => {
    router.push(`/book/edit/${id}`);
  };

  const handleBookDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm to delete?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await deleteBook(id);
        message.success("Book deleted successfully!");
        // 重新获取数据
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    // pagination获取的数据：已设置的pagination参数 + total参数（表示总数据量）
    setPagination(pagination); // 将新的pagination参数设置到pagination变量里
    const query = form.getFieldsValue();
    const res = await getBookList({
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
                handleBookEdit(row._id);
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                handleBookDelete(row._id);
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
      title="Book List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/book/add");
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
            <Form.Item name="author" label="Author">
              <Input placeholder="Please enter" allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="Category">
              <Select
                placeholder="Please select"
                allowClear
                showSearch
                style={{ width: 150 }}
                options={categoryList?.map((item: CategoryType) => ({
                  label: item.name,
                  value: item._id,
                }))}
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
