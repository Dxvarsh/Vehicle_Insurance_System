# Notification Module API cURLs

## 1. Get My Notifications (Customer)

**Endpoint:** `GET /api/notifications/my`
**Description:** Retrieves a paginated list of notifications for the logged-in customer.

```bash
curl --location 'http://localhost:5000/api/notifications/my?page=1&limit=10' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>'
```

---

## 2. Get Unread Count (Customer)

**Endpoint:** `GET /api/notifications/unread-count`
**Description:** Returns the count of unread notifications.

```bash
curl --location 'http://localhost:5000/api/notifications/unread-count' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>'
```

---

## 3. Mark as Read (Customer)

**Endpoint:** `PUT /api/notifications/:id/read`
**Description:** Marks a single notification as read.

```bash
curl --location --request PUT 'http://localhost:5000/api/notifications/<NOTIFICATION_ID>/read' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>'
```

---

## 4. Mark All as Read (Customer)

**Endpoint:** `PUT /api/notifications/read-all`
**Description:** Marks all notifications for the customer as read.

```bash
curl --location --request PUT 'http://localhost:5000/api/notifications/read-all' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>'
```

---

## 5. Send Custom Notification (Admin)

**Endpoint:** `POST /api/notifications/send`
**Description:** Admin manually sends a notification to a specific customer.

```bash
curl --location 'http://localhost:5000/api/notifications/send' \
--header 'Authorization: Bearer <ADMIN_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "customerID": "<CUSTOMER_OBJECT_ID>",
    "title": "Welcome to VIMS",
    "message": "Your profile has been successfully verified by our team.",
    "messageType": "General"
}'
```

---

## 6. View All Logs (Admin)

**Endpoint:** `GET /api/notifications`
**Description:** Admin views all notification logs sent across the system.

```bash
curl --location 'http://localhost:5000/api/notifications?page=1&limit=20' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```
