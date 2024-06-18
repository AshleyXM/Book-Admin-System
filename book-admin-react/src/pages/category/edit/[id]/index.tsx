import CategoryForm from "@/components/CategoryForm";
import { getCategoryDetail } from "@/pages/api/category";
import { CategoryType } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryEdit() {
  const router = useRouter();
  const [editData, setEditData] = useState<CategoryType>();
  useEffect(() => {
    const categoryId = router.query.id;
    if (categoryId) {
      getCategoryDetail(categoryId as string).then((res) => {
        setEditData(res.data);
      });
    }
  }, [router.query.id]);
  return (
    <CategoryForm title="Edit the Category" editData={editData}></CategoryForm>
  );
}
