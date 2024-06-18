import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import {
  addCategory,
  getCategoryList,
  updateCategory,
} from "@/pages/api/category";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import Content from "../Content";
import { LEVEL_OPTIONS } from "@/pages/category";
import { CategoryType } from "@/types";

export default function CategoryForm({
  title,
  editData,
}: {
  title: string;
  editData?: CategoryType;
}) {
  // 当useState有默认初值时，会自动判定previewUrl的类型
  // 否则，需要在useState后面加上一个类型，如useState<string>()
  const [form] = Form.useForm(); // 创建一个Form实例，并绑定到下面创建的form上

  const [level, setLevel] = useState(1);
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data } = await getCategoryList({ all: true, level: 1 }); // all参数表示不分页，取全部数据
      setLevelOneList(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (editData?._id) {
      form.setFieldsValue(editData);
    }
  }, [editData, form]);

  // 这里用useMemo表示只有当levelOneList发生变化，才重新计算levelOneOptions
  // 否则用之前的缓存值，从而避免不必要的计算
  const levelOneOptions = useMemo(() => {
    return levelOneList.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [levelOneList]);

  const handleFinish = async (values: CategoryType) => {
    if (editData) {
      await updateCategory(editData._id, { ...values });
      message.success("Category modified successfully!");
    } else {
      await addCategory(values);
      message.success("Category added successfully!");
    }

    router.push("/category");
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
            label="Level"
            name="level"
            rules={[
              {
                required: true,
                message: "Please select level",
              },
            ]}
          >
            <Select
              placeholder="Please select"
              allowClear
              onChange={(value) => {
                setLevel(value);
              }}
              disabled={!!editData?._id}
              options={LEVEL_OPTIONS}
            ></Select>
          </Form.Item>
          {(level === 2 || editData?.level === 2) && (
            <Form.Item
              label="Parent Level"
              name="parent"
              rules={[
                {
                  required: true,
                  message: "Please select parent level",
                },
              ]}
            >
              <Select
                placeholder="Please select"
                allowClear
                options={levelOneOptions}
              ></Select>
            </Form.Item>
          )}
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
