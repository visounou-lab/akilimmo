import { prisma } from "./prisma";

type CreateNotificationInput = {
  userId: string;
  title: string;
  body: string;
  category: "BOOKING" | "PAYMENT" | "DOCUMENT" | "ALERT";
  actionUrl?: string;
  propertyId?: string;
};

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({ data: input });
}
