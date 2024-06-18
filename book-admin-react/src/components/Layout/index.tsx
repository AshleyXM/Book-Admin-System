import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Head from "next/head";
import type { MenuProps } from "antd";
import {
  Layout as AntdLayout,
  Menu,
  Image,
  Dropdown,
  Space,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

const { Header, Content, Sider } = AntdLayout;

const MENU_ITEMS = [
  {
    key: "book",
    label: "Book Management",

    children: [
      { label: "Book List", key: "/book" },
      { label: "Add a Book", key: "/book/add" },
    ],
  },
  {
    key: "category",
    label: "Category Management",

    children: [
      { label: "Category List", key: "/category" },
      { label: "Add a Category", key: "/category/add" },
    ],
  },
  {
    key: "loan",
    label: "Loan Management",

    children: [
      { label: "Loan List", key: "/loan" },
      { label: "Add a Loan", key: "/loan/add" },
    ],
  },
  {
    key: "user",
    label: "User Management",

    children: [
      { label: "User List", key: "/user" },
      { label: "Add a User", key: "/user/add" },
    ],
  },
];

// export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    // handleMenuClick是menu组件的onClick对应的方法，所以类型为MenuProps["onClick"]
    router.push(key);
  };

  const activeMenu = router.pathname;

  const [user, setUser] = useState({ info: { _id: 0, name: "" } });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStorage = localStorage?.getItem("user");
      if (userStorage) {
        setUser(JSON.parse(userStorage));
      }
    }
  }, []);

  const USER_ITEMS: MenuProps["items"] = [
    {
      label: <Link href={`/user/edit/${user.info._id}`}>Profile</Link>,
      key: "0",
    },
    {
      label: (
        <span
          onClick={async () => {
            localStorage.removeItem("user");
            message.success("Logout successfully!");
            router.push("/login");
          }}
        >
          Logout
        </span>
      ),
      key: "1",
    },
  ];

  return (
    <>
      <Head>
        <title>Book Administration System</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <AntdLayout>
          <Header className={styles.header}>
            <span className={styles.logo}>
              <Image src="/logo.png" width={60} height={60} />
            </span>
            Book Administration System
            <span className={styles.user}>
              <Dropdown menu={{ items: USER_ITEMS }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {user?.info?.name ? user?.info?.name : "username"}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </span>
          </Header>
          <AntdLayout className={styles.sectionInner}>
            <Sider width={220}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["/book"]}
                defaultOpenKeys={["book"]}
                selectedKeys={[activeMenu]}
                style={{ height: "100%", borderRight: 0 }}
                items={MENU_ITEMS}
                onClick={handleMenuClick}
              />
            </Sider>
            <AntdLayout className={styles.sectionContent}>
              <Content>{children}</Content>
            </AntdLayout>
          </AntdLayout>
        </AntdLayout>
      </main>
    </>
  );
}
