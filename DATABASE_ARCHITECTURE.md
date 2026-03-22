# 🏛️ Mochi: Core Database Architecture

## 📖 Overview
This document outlines the complete relational database architecture for the Mochi Virtual Teaching Assistant backend. It is currently hosted on a serverless **Neon PostgreSQL** cloud environment to act as the Single Source of Truth for the development team. 

The schema is designed to be **Multi-Tenant** (supporting multiple nursery branches) and prioritizes strict **Data Integrity** and **Child Safety**.

---

## 🗄️ The 12-Table Schema & Reasoning

### 1. The Organizational Layer
* **`institutes`**: The root of the hierarchy. 
    * **Columns:** `inst_id` (PK), `name` (NOT NULL), `location`.
    * *Why?* Mochi must be scalable. If a school opens a second branch, the database handles it natively without creating a separate database instance.
* **`users`**: The central login table for WSO2 Asgardeo integration.
    * **Columns:** `user_id` (PK), `email` (UNIQUE, NOT NULL), `password_hash`, `role` (teacher/parent).
    * *Why?* Centralizing authentication prevents duplicate accounts.

### 2. The Administrative Layer
* **`teachers`**: 
    * **Columns:** `teacher_id` (PK), `inst_id` (FK), `user_id` (FK), `full_name` (NOT NULL).
* **`classrooms`**: 
    * **Columns:** `classroom_id` (PK), `room_number` (NOT NULL), `grade_level`, `section`, `inst_id` (FK), `teacher_id` (FK).
    * *Why?* By linking classrooms directly to an institute and a teacher, we establish strict chains of command. A teacher cannot exist outside an institute.

### 3. The Core Entity Layer
* **`parents`**: 
    * **Columns:** `parent_id` (PK), `user_id` (FK), `inst_id` (FK), `full_name` (NOT NULL).
* **`students`**: The heart of the database.
    * **Columns:** `student_id` (PK), `name` (NOT NULL), `parent_id` (FK), `classroom_id` (FK).
    * *Why?* Every student *must* be tied to a parent and a classroom. This prevents "orphan" student profiles.

### 4. Health & Safety Layer (Strict Constraints)
* **`health_profiles`**: 
    * **Columns:** `student_id` (FK), `allergies`, `emergency_contact` (NOT NULL).
    * *Why NOT NULL?* Child safety is critical. The system refuses to create a health profile if an emergency contact is missing.
* **`medication_schedules`** & **`medication_logs`**: 
    * *Why?* Separates the "prescription" (schedule) from the actual "action" (log) of giving the medicine, allowing for secure daily auditing.

### 5. AI & Developmental Layer
* **`revision_scores`** & **`speech_assessments`**: Tracks Mochi's AI evaluations of the students.
* **`media_assets`**: The digital library for Google Cloud Storage.
    * **Columns:** `file_url` (NOT NULL), `asset_type`, `student_id` (FK, Optional), `search_query`.
    * *Why CHECK constraints?* We use a `CHECK` constraint on `asset_type` to only allow specific values (e.g., `'profile_pic'`, `'generated_search'`). This prevents corrupt or mislabeled data from entering the Google Cloud ecosystem.



---

## 🔗 Key Architectural Decisions

### 1. Referential Integrity & Cascading Deletes
Almost every Foreign Key utilizes `ON DELETE CASCADE`.
* *Why?* If an `institute` is deleted from the system, PostgreSQL will automatically delete all associated classrooms, teachers, and students. This prevents fatal application crashes caused by querying data that no longer has a home.

### 2. The "Master View" Joins Logic
When fetching the Teacher Dashboard, we use specific `JOIN` types intentionally:
* **`INNER JOIN` (e.g., Students to Classrooms):** Used for strict requirements. A student *must* have a classroom to be queried.
* **`LEFT JOIN` (e.g., Students to Health Profiles/Medications):** Used for optional data. A student might not have daily medication. If we used an `INNER JOIN`, healthy students would disappear from the roster. `LEFT JOIN` ensures the student is listed, with medication simply showing as `NULL`.