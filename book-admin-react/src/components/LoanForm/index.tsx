import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { addLoan, updateLoan } from "@/pages/api/loan";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import Content from "../Content";
import { LoanType, BookType, UserType } from "@/types";
import { getBookDetail, getBookList } from "@/pages/api/book";
import { getUserList } from "@/pages/api/user";

export default function LoanForm({
  title,
  editData,
}: {
  title: string;
  editData: LoanType;
}) {
  const [form] = Form.useForm(); // 创建一个Form实例，并绑定到下面创建的form上

  const router = useRouter();

  const [bookList, setBookList] = useState<BookType[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);

  const [stock, setStock] = useState(0);

  const handleFinish = async (values: LoanType) => {
    if (editData) {
      await updateLoan(editData._id, values);
      message.success("Loan modified successfully!");
    } else {
      await addLoan(values);
      message.success("Loan added successfully!");
    }
    router.push("/loan");
  };

  useEffect(() => {
    getBookList({ all: true }).then((res) => {
      setBookList(res.data);
    });
    getUserList({ all: true }).then((res) => {
      setUserList(res.data);
    });
  }, []);

  useEffect(() => {
    if (editData?._id) {
      // form.setFieldsValue(editData);
    }
  }, [editData, form]);

  const handleBookChange = (_: number, option: any) => {
    // option参数为map函数里返回的对象
    if (option) {
      setStock(option?.stock);
    } else {
      setStock(0);
    }
  };

  return (
    <>
      <Content title={title}>
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Book name"
            name="book"
            rules={[
              {
                required: true,
                message: "Please select book name",
              },
            ]}
          >
            <Select
              placeholder="Please select"
              allowClear
              onChange={handleBookChange}
              options={bookList.map((item: BookType) => ({
                label: item.name,
                value: item._id,
                stock: item.stock,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Borrower"
            name="user"
            rules={[
              {
                required: true,
                message: "Please select borrower",
              },
            ]}
          >
            <Select
              placeholder="Please select"
              allowClear
              options={userList.map((item: UserType) => ({
                label: item.name,
                value: item._id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Stock" name="stock">
            {stock}
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              disabled={stock <= 0}
              className={styles.btn}
            >
              {editData?._id ? "Modify" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
}
