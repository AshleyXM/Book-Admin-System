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
import { deleteLoan, getLoanList, updateLoan } from "../api/loan";
import { LoanQueryType, BookType, LoanType, UserType } from "@/types";
import Content from "@/components/Content";
import { getBookList } from "../api/book";
import { getUserList } from "../api/user";

enum STATUS {
  ON = "on",
  OFF = "off",
}

const STATUS_OPTIONS = [
  { label: "On Loan", value: STATUS.ON },
  { label: "Returned", value: STATUS.OFF },
];

const COLUMNS = [
  {
    title: "Book Name",
    dataIndex: "bookName",
    key: "bookName",
    width: 160,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text: string) =>
      // return (
      //   <Tag color={text === STATUS.ON ? "green" : "red"}>
      //     {text === STATUS.ON ? "On Loan" : "Returned"}
      //   </Tag>
      // );
      text === STATUS.ON ? (
        <Tag color="green">On Loan</Tag>
      ) : (
        <Tag color="red">Returned</Tag>
      ),
  },
  {
    title: "Borrower",
    dataIndex: "borrower",
    key: "borrower",
    width: 160,
  },
  {
    title: "Loan Time",
    dataIndex: "loanedAt",
    key: "loanedAt",
    width: 180,
    render: (text: number) => {
      return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "Return Time",
    dataIndex: "returnedAt",
    key: "returnedAt",
    width: 180,
    render: (text: number) => {
      if (text === 0) {
        return "-";
      }
      return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
    },
  },
];

export default function Loan() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);

  const [bookList, setBookList] = useState<BookType[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0,
  });

  async function fetchData(values?: LoanQueryType) {
    const res = await getLoanList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values,
    });

    const parsedData = res.data.map((item: LoanType) => ({
      ...item,
      bookName: item.book.name, // 将书籍名信息从book中解析出来
      borrower: item.user.name, // 将借阅人姓名从user中解析出来
    }));
    setDataSource(parsedData);

    setPagination({ ...pagination, total: res.total });
  }

  useEffect(() => {
    fetchData();
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
    getUserList({ all: true }).then((res) => {
      setUserList(res.data);
    });
  }, []); // dependency array必须设置为空数组，表示只在mount的时候运行一次

  const handleSearchFinish = async (values: LoanQueryType) => {
    const res = await getLoanList({
      ...values,
      current: 1,
      pageSize: pagination.pageSize,
    });
    const parsedData = res.data.map((item: LoanType) => ({
      ...item,
      bookName: item.book.name, // 将书籍名信息从book中解析出来
      borrower: item.user.name, // 将借阅人姓名从user中解析出来
    }));
    setDataSource(parsedData);
    // 注意total不能设置成res.data.length，因为res.data只是分页的数据，并不是总的数据
    setPagination({ ...pagination, current: 1, total: res.total });
  };

  const handleSearchClear = () => {
    console.log(form);
    // 清空需要拿到表单示例，将表单的几个field清空
    form.resetFields();
  };

  const handleLoanReturn = async (id: string) => {
    await updateLoan(id, { status: STATUS.OFF, returnedAt: Date.now() });
    fetchData(form.getFieldsValue());
  };

  const handleLoanDelete = (row: LoanType) => {
    if (row.status === STATUS.ON) {
      return message.warning("The book on loan cannot be deleted!");
    }
    Modal.confirm({
      title: "Confirm to delete?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await deleteLoan(row._id);
        message.success("Loan deleted successfully!");
        // 重新获取数据
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleTableChange = async (pagination: TablePaginationConfig) => {
    // pagination获取的数据：已设置的pagination参数 + total参数（表示总数据量）
    setPagination(pagination); // 将新的pagination参数设置到pagination变量里
    const query = form.getFieldsValue();
    const res = await getLoanList({
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
            {row.status === STATUS.ON && (
              <Button
                type="link"
                onClick={() => {
                  handleLoanReturn(row._id);
                }}
              >
                Return
              </Button>
            )}
            <Button
              type="link"
              danger
              onClick={() => {
                handleLoanDelete(row);
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
      title="Loan List"
      operation={
        <Button
          type="primary"
          onClick={() => {
            router.push("/loan/add");
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
          name: [],
          status: [],
          category: [],
        }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="book" label="Book Name">
              <Select
                placeholder="Please select"
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: 150 }}
                options={bookList.map((item: BookType) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
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
          <Col span={5}>
            <Form.Item name="user" label="Borrower">
              <Select
                placeholder="Please select"
                allowClear
                showSearch
                style={{ width: 150 }}
                options={userList.map((item: UserType) => ({
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
