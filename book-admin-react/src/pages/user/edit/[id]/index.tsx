import UserForm from "@/components/UserForm";
import { getUserDetail } from "@/pages/api/user";
import { UserType } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserEdit() {
  const router = useRouter();

  const [editData, setEditData] = useState<UserType>();
  useEffect(() => {
    const userId = router.query.id;
    if (userId) {
      getUserDetail(userId as string).then((res) => {
        setEditData(res.data);
      });
    }
  }, [router.query.id]);

  return <UserForm title="Edit the User" editData={editData}></UserForm>;
}
