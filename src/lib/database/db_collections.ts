
import { Collection, Db } from "mongodb";
import clientPromise from "./db_connection";
import { Users } from "../../Interfaces/userInterfaces";
import { ProductType } from "@/Interfaces/productInterfaces";
import { CategoryType } from "@/Interfaces/categoryInterfaces";
import { ReviewsType } from "@/Interfaces/reviewInterfaces";
import { WishlistType } from "@/Interfaces/wishListInterfaces";
import { Cart } from "@/Interfaces/cartInterface";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import { NewsletterSubscriberType } from "@/Interfaces/newsLetterInterface";
import { NotificationType } from "@/Interfaces/notificationInterfaces";
import { AdminTokenType } from "@/Interfaces/adminTokenInterfaces";


// Define the User type (you can extend it as needed)


export const getUserCollection = async (): Promise<Collection<Users>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<Users>("users");
};

export const getProductCollection = async (): Promise<Collection<ProductType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<ProductType>("Products");
};
export const getCategoryCollection = async (): Promise<Collection<CategoryType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<CategoryType>("Categories");
};
export const getReviewCollection = async (): Promise<Collection<ReviewsType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<ReviewsType>("Reviews");
};
export const getWishlistCollection = async (): Promise<Collection<WishlistType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<WishlistType>("WishList");
};
export const getCartCollection = async (): Promise<Collection<Cart>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<Cart>("Cart");
};
export const getOrderCollection = async (): Promise<Collection<CheckoutDataType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<CheckoutDataType>("Orders");
};
export const getNewsLetterCollection = async (): Promise<Collection<NewsletterSubscriberType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<NewsletterSubscriberType>("NewsLetter");
};
export const getNotificationCollection = async (): Promise<Collection<NotificationType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<NotificationType>("Notification");
};
export const getAdminTokenCollection = async (): Promise<Collection<AdminTokenType>> => {
  const client = await clientPromise;
  const db: Db = client.db("tekzoBd-database"); // Replace with your database name
  return db.collection<AdminTokenType>("AdminToken");
};
