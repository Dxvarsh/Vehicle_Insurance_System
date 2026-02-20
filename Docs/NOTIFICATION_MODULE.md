# 📄 Notification System Module - Technical Documentation

## Module Overview

The **Notification System Module** is a critical communication layer that keeps customers informed about their policy status, payment successes, and claim progress. It also allows administrators to broadcast general announcements or specifically target customers with manual messages.

## Features

- **Automated Alerts**: System-generated notifications for policy expiry, renewals, and payments.
- **Claim Updates**: Real-time status changes for insurance claims trigger instant notifications.
- **Notification Center**: A centralized UI for customers to view and manage their history.
- **Admin Broadcasts**: Tools for admins to send custom messages to specific users.
- **Unread Tracking**: Visual indicators for new messages with easy "Mark all as Read" functionality.
- **Notification Logs**: Detailed audit trail for administrators to track sent communications.

## Database Schema (Notification Model)

| Field            | Type       | Description                                                       |
| :--------------- | :--------- | :---------------------------------------------------------------- |
| `notificationID` | `String`   | Unique ID (e.g., NOTIF-00001)                                     |
| `customerID`     | `ObjectId` | Reference to the Customer                                         |
| `policyID`       | `ObjectId` | Reference to the associated Policy (optional)                     |
| `messageType`    | `String`   | Enum: ['Expiry', 'Renewal', 'Claim-Update', 'Payment', 'General'] |
| `title`          | `String`   | Header of the notification                                        |
| `message`        | `String`   | Full body text of the alert                                       |
| `sentDate`       | `Date`     | Timestamp of when it was created                                  |
| `isRead`         | `Boolean`  | Tracking read/unread status                                       |
| `deliveryStatus` | `String`   | Enum: ['Sent', 'Delivered', 'Failed']                             |

## API Endpoints

### Customer APIs

| Method   | Endpoint                          | Description                                          |
| :------- | :-------------------------------- | :--------------------------------------------------- |
| `GET`    | `/api/notifications/my`           | Get all notifications for logged-in user (paginated) |
| `GET`    | `/api/notifications/unread-count` | Get total number of unread alerts                    |
| `PUT`    | `/api/notifications/:id/read`     | Mark a specific notification as read                 |
| `PUT`    | `/api/notifications/read-all`     | Mark all notifications as read in one click          |
| `DELETE` | `/api/notifications/:id`          | Delete a single notification from history            |

### Admin APIs

| Method   | Endpoint                  | Description                                        |
| :------- | :------------------------ | :------------------------------------------------- |
| `GET`    | `/api/notifications`      | View all system-wide notification logs (paginated) |
| `POST`   | `/api/notifications/send` | Send a custom manual notification to a customer    |
| `DELETE` | `/api/notifications/:id`  | Delete any notification record                     |

## Business Rules

1. **Auto-Triggering**:
   - Notifications MUST be created within the controller logic of other modules (e.g., when a claim status changes or a payment is successful).
2. **Access Control**:
   - Customers can ONLY view and modify (read/delete) notifications belonging to their `customerID`.
3. **Storage**:
   - Notification records are persisted in the database with timestamps for audit purposes.
4. **Visibility**:
   - Unread notifications should be prominently displayed on the Customer Dashboard.

## Workflow Statuses

- **Sent**: Notification record created and available in DB.
- **Delivered**: Reserved for future integration with Email/SMS providers.
- **Failed**: Error encountered during manual send.
