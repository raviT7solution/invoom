import { createConsumer } from "@rails/actioncable";

export const consumer = createConsumer(
  `${import.meta.env.VITE_BACKEND_BASE_URL}/cable`,
);
