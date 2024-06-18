import BookForm from "@/components/BookForm";
import { getBookDetail } from "@/pages/api/book";
import { BookType } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BookEdit() {
  const router = useRouter();
  const [editData, setEditData] = useState<BookType>();
  useEffect(() => {
    const bookId = router.query.id;
    if (bookId) {
      getBookDetail(bookId as string).then((res) => {
        setEditData(res.data);
      });
    }
  }, [router.query.id]);
  return <BookForm title="Edit the Book" editData={editData}></BookForm>;
}
