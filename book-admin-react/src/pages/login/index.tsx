import { Button, Form, Input, message } from "antd";
import styles from "./index.module.css";
import { login } from "../api/user";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const handleFinish = async (values: { name: string; password: string }) => {
    const res = await login(values);
    if (res.success) {
      message.success("Login successfully!");
      // save the user
      localStorage.setItem(
        "user",
        JSON.stringify({ info: res.data, token: res.token })
      );
      router.push("/book");
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Admin System</h2>
      <Form labelCol={{ span: 6 }} onFinish={handleFinish}>
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
          <Input placeholder="Please enter" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter password",
            },
          ]}
        >
          <Input.Password placeholder="Please enter" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
