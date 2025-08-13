import { createNotification } from './createNotification';
import { sendNotification } from './sendNotification';
import { sendNotificationToUsers } from './sendNotificationToUsers';
import { sendNotificationToAll } from './sendNotificationToAll';
import { updateNotification } from './updateNotification';
import { deleteNotification } from './deleteNotification';

export const notificationsMutations = {
  createNotification,
  sendNotification,
  sendNotificationToUsers,
  sendNotificationToAll,
  updateNotification,
  deleteNotification
};
