import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Radio } from "antd";
import { addUser, updateUser } from "@/pages/api/user";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import Content from "../Content";
import { UserType } from "@/types";
import { USER_ROLE, USER_SEX, USER_STATUS } from "@/constant/user";

export default function UserForm({
  title,
  editData,
}: {
  title: string;
  editData?: UserType;
}) {
  const [form] = Form.useForm(); // 创建一个Form实例，并绑定到下面创建的form上

  const router = useRouter();

  const handleFinish = async (values: UserType) => {
    if (editData) {
      await updateUser(editData._id, { ...values });
      message.success("User modified successfully!");
    } else {
      await addUser(values);
      message.success("User added successfully!");
    }
    router.push("/user");
  };

  useEffect(() => {
    if (editData?._id) {
      form.setFieldsValue(editData);
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
          initialValues={{
            sex: USER_SEX.MALE,
            status: USER_STATUS.ENABLED,
            role: USER_ROLE.USER,
          }}
        >
          <Form.Item
            label="Account"
            name="account"
            rules={[
              {
                required: true,
                message: "Please enter account",
              },
            ]}
          >
            <Input allowClear placeholder="Please enter" />
          </Form.Item>
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
          <Form.Item label="Sex" name="sex">
            <Radio.Group>
              <Radio value={USER_SEX.MALE}>Male</Radio>
              <Radio value={USER_SEX.FEMALE}>Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Radio.Group>
              <Radio value={USER_STATUS.ENABLED}>Enabled</Radio>
              <Radio value={USER_STATUS.DISABLED}>Disabled</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Please enter" />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Radio.Group>
              <Radio value={USER_ROLE.USER}>User</Radio>
              <Radio value={USER_ROLE.ADMIN}>Administrator</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className={styles.btn}
            >
              {editData ? "Modify" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
}
