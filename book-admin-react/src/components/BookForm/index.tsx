import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Image,
  message,
} from "antd";
import { addBook, updateBook } from "@/pages/api/book";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import styles from "./index.module.css";
import Content from "../Content";
import { BookType, CategoryType } from "@/types";
import { getCategoryList } from "@/pages/api/category";

const { TextArea } = Input;

export default function BookForm({
  title,
  editData,
}: {
  title: string;
  editData?: BookType;
}) {
  // 当useState有默认初值时，会自动判定previewUrl的类型
  // 否则，需要在useState后面加上一个类型，如useState<string>()
  const [previewUrl, setPreviewUrl] = useState("");
  const [form] = Form.useForm(); // 创建一个Form实例，并绑定到下面创建的form上

  const router = useRouter();

  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [cover, setCover] = useState("");

  const handleFinish = async (values: BookType) => {
    // 将出版时间转换成时间戳的形式，unix是秒级，valueOf是毫秒级
    if (values.publishedAt) {
      values.publishedAt = dayjs(values.publishedAt).valueOf();
    }

    if (editData) {
      await updateBook({ ...values, _id: editData._id });
      message.success("Book modified successfully!");
    } else {
      await addBook(values);
      message.success("Book added successfully!");
    }
    router.push("/book");
  };

  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  useEffect(() => {
    if (editData?._id) {
      editData.publishedAt = dayjs(editData.publishedAt);
      editData.category = editData.category?._id;
      setCover(editData.cover);
      form.setFieldsValue({ ...editData });
    }
  }, [editData, form]);
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter name",
              },
            ]}
          >
            <Input allowClear placeholder="Please enter" />
          </Form.Item>
          <Form.Item
            label="Author"
            name="author"
            rules={[
              {
                required: true,
                message: "Please enter author",
              },
            ]}
          >
            <Input allowClear placeholder="Please enter" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Please select category",
              },
            ]}
          >
            <Select
              placeholder="Please select"
              allowClear
              options={categoryList.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item label="Cover" name="cover">
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="Please enter"
                style={{ width: "calc(100% - 80px)" }}
                onChange={(e) => {
                  form.setFieldValue("cover", e.target.value);
                }}
                value={cover}
              />
              <Button
                type="primary"
                onClick={() => {
                  setPreviewUrl(form.getFieldValue("cover"));
                }}
              >
                Preview
              </Button>
            </Space.Compact>
          </Form.Item>
          {previewUrl && (
            <Form.Item label=" " colon={false}>
              <Image src={previewUrl} width={100} height={100} />
            </Form.Item>
          )}
          <Form.Item label="Publication Date" name="publishedAt">
            <DatePicker allowClear />
          </Form.Item>
          <Form.Item label="Stock" name="stock">
            <InputNumber
              placeholder="Please enter"
              min={1}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} allowClear placeholder="Please enter" />
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
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
