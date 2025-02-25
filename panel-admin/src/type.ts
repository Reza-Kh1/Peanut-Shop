type PaginationType = {
  allPage: number;
  nextPage: number;
  prevPage: number;
};
type UserType = {
  id: string;
  name: string;
  password: string;
  email: string | null;
  phone: string | null;
  role: "ADMIN" | "AUTHOR" | "CUSTOMER";
  createdAt: Date;
  updatedAt: Date;
};
type CategoryType = {
  name: string;
  id: number;
  subCategoryTo?: CategoryType;
  subCategorys?: CategoryType[];
};
type ProductType = {
  id: number;
  isStatus: boolean;
  isAvailable: boolean;
  refCode: string;
  slug: string;
  name: string;
  gallery: { url: string, alt: string }[] | null;
  description: string;
  tags: string[];
  price: number;
  weight: number;
  stock: number;
  detail: string;
  rating: string;
  totalComment: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  discountId: string | null;
  categoryId: string;
  Category: CategoryType;
  Comment: [];
  Discount: DiscountType
  User: {
    name: string;
    role: string;
  };
};
type DiscountType = {
  id: number;
  amount: number;
  code: string;
  type: "FIXED" | "PERCENT";
  discount: number;
  startDate: Date;
  endDate: Date;
};
type CommentType = {
  id: number
  isApproved: boolean
  name: string
  phone: string
  email: string
  content: string
  rating: number
  createdAt: Date
  productId: number
  Product: {
    name: string
    slug: string
  }
}
type ChatType = {
  id: number
  title: string
  isDone: boolean
  userId: string
  createdAt: Date
  User: UserType
  Message: MessaheType[]
}
type MessaheType = {
  content: string
  senderType: "CUSTOMER" | "ADMIN"
  createdAt: Date
}
export type {
  UserType,
  CommentType,
  PaginationType,
  CategoryType,
  ProductType,
  DiscountType, ChatType, MessaheType
};
