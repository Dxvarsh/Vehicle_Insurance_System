# Dashboard & Reports API cURLs

## 1. Get Dashboard Stats (Admin/Staff)

**Endpoint:** `GET /api/dashboard/stats`

```bash
curl --location 'http://localhost:5000/api/dashboard/stats' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

---

## 2. Get Chart Data (Admin/Staff)

**Endpoint:** `GET /api/dashboard/charts`

```bash
curl --location 'http://localhost:5000/api/dashboard/charts' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

---

## 3. Get Policy Report (Admin)

**Endpoint:** `GET /api/dashboard/reports?type=policies`

```bash
curl --location 'http://localhost:5000/api/dashboard/reports?type=policies' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

---

## 4. Get Premium Report (Admin)

**Endpoint:** `GET /api/dashboard/reports?type=premiums`

```bash
curl --location 'http://localhost:5000/api/dashboard/reports?type=premiums' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

---

## 5. Get Claim Report (Admin)

**Endpoint:** `GET /api/dashboard/reports?type=claims`

```bash
curl --location 'http://localhost:5000/api/dashboard/reports?type=claims' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```
