# Mobile Migration Analysis - Expo SDK 56 Architecture

## Objective

Tôi đã có một dự án Web Frontend hoàn chỉnh "smart-wardrobe-fe".

Mục tiêu là phân tích source hiện tại để xây dựng Mobile App bằng Expo React Native.

KHÔNG code.

Chỉ phân tích, đánh giá và lập kế hoạch triển khai Mobile.

---

# Target Technology Stack

Mobile App bắt buộc sử dụng stack sau:

## Core

* Expo SDK 56
* React Native
* TypeScript

## Navigation

* Expo Router

## API Layer

* Axios

## Server State

* TanStack Query

## Client State

* Zustand

## Form Handling

* React Hook Form

## Validation

* Zod

## Styling

* NativeWind

## Media

* Expo Image
* Expo Image Picker
* Expo Camera

## Storage

* Expo Secure Store
* React Native MMKV

## Animation

* React Native Reanimated

## Gesture

* React Native Gesture Handler

## Bottom Sheet

* @gorhom/bottom-sheet

## Icons

* Lucide React Native

## Monitoring

* Sentry

Mọi đề xuất kiến trúc phải tương thích với stack trên.

---

# Target Folder Structure

Mobile App phải tuân thủ cấu trúc sau:

src/
├── app/
├── features/
│   ├── auth/
│   ├── wardrobe/
│   ├── outfit/
│   └── profile/
├── components/
├── services/
├── hooks/
├── stores/
├── types/
├── lib/
├── constants/
└── utils/

Khi phân tích source Web, hãy map toàn bộ chức năng vào cấu trúc này.

---

# Analysis Requirements

## 1. Business Domain Analysis

Xác định:

* Business Goal
* Core Features
* User Roles
* Main User Flows

Tạo sơ đồ flow nghiệp vụ.

---

## 2. Feature Extraction

Quét toàn bộ source code.

Liệt kê:

### Authentication

Màn hình

API

Logic

State

Validation

---

### Wardrobe

Màn hình

API

Logic

Business Rules

---

### Outfit

Màn hình

API

Logic

Business Rules

---

### Profile

Màn hình

API

Logic

Business Rules

---

### Other Features

Notification

Weather

AI Recommendation

Settings

Search

Upload

Analytics

v.v.

---

# Routing Analysis

Quét toàn bộ route Web.

Tạo bảng:

| Web Route | Feature | Mobile Screen |
| --------- | ------- | ------------- |

Ví dụ:

/login → LoginScreen

/register → RegisterScreen

/wardrobe → WardrobeScreen

/item/[id] → ItemDetailScreen

/profile → ProfileScreen

---

# Screen Inventory

Cho mỗi màn hình:

## Screen Name

### Purpose

### User Actions

### APIs Used

### Query Hooks

### Mutation Hooks

### Navigation Flow

### State Dependencies

### Validation Requirements

### Native Features Required

Ví dụ:

Camera

Image Picker

Bottom Sheet

Push Notification

Share API

---

# API Analysis

Quét:

services/

api/

repositories/

hooks/

Tạo:

## Authentication APIs

### Login

Method

Endpoint

Request

Response

Error Cases

Token Strategy

---

## Wardrobe APIs

---

## Outfit APIs

---

## Profile APIs

---

# State Management Analysis

Quét:

Redux

Context

Zustand

Local State

Cookies

Storage

Phân tích cách migrate sang:

## Zustand Store

Ví dụ:

auth.store.ts

user.store.ts

wardrobe.store.ts

settings.store.ts

Mỗi store phải mô tả:

State

Actions

Persistence Strategy

Dependencies

---

# Form Analysis

Tìm tất cả form hiện có.

Map sang:

React Hook Form

*

Zod

Cho từng form:

Validation Rules

Field Types

Error Handling

Submit Flow

---

# Data Fetching Analysis

Tìm tất cả:

fetch

axios

SWR

React Query

Custom API Clients

Map sang:

TanStack Query

Tạo danh sách:

## Queries

queryKey

endpoint

cache strategy

---

## Mutations

endpoint

optimistic update

invalidate strategy

---

# Component Analysis

Quét toàn bộ components.

Phân loại:

## Reusable Business Logic

Có thể tái sử dụng:

Validation

API Hooks

Transformation Logic

Utilities

Types

Constants

Business Rules

---

## Must Rewrite For Mobile

Navbar

Sidebar

Desktop Layout

Tables

Hover Components

Desktop Modals

Responsive Containers

Charts

Drag & Drop

---

# Design System Analysis

Trích xuất:

## Colors

## Typography

## Border Radius

## Shadows

## Spacing

## Iconography

## Theme

Đề xuất triển khai bằng:

NativeWind

Design Tokens

Theme Constants

---

# Mobile UX Adaptation

Đánh giá từng màn hình.

Chuyển đổi:

Sidebar
→ Bottom Tabs

Modal
→ Bottom Sheet

Table
→ FlatList

Grid
→ FlashList hoặc FlatList

Hover
→ Pressable

Desktop Form
→ Mobile Form

Pagination
→ Infinite Scroll

---

# Native Features Analysis

Xác định nơi có thể sử dụng:

Expo Camera

Expo Image Picker

Secure Store

MMKV

Notifications

Deep Linking

Sharing

Offline Storage

Biometric Authentication

---

# Architecture Proposal

Đề xuất kiến trúc Mobile theo chuẩn Feature-Based.

Ví dụ:

src/
├── app/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── screens/
│   │   ├── types/
│   │   └── components/
│   ├── wardrobe/
│   ├── outfit/
│   └── profile/

Mỗi feature phải độc lập.

---

# Technical Risks

Liệt kê:

* Web-only libraries
* Browser APIs
* SSR Dependencies
* DOM Manipulation
* LocalStorage Usage
* Window Usage
* Document Usage
* Canvas Usage

Đánh giá mức độ khó khi migrate.

---

# Development Roadmap

Phase 1

Foundation

* Expo Setup
* Router
* Theme
* Query Client
* Zustand
* Axios

Phase 2

Authentication

Phase 3

Wardrobe

Phase 4

Outfit

Phase 5

Profile

Phase 6

Native Features

Phase 7

Optimization

Phase 8

Release

---

# Final Deliverables

Xuất báo cáo gồm:

1. Executive Summary

2. Feature Inventory

3. Route Mapping

4. Screen Inventory

5. API Inventory

6. Zustand Store Design

7. Query Design

8. Form Design

9. Reusable Logic

10. Components To Rewrite

11. Mobile Architecture

12. Native Features

13. Technical Risks

14. Development Roadmap

15. Estimated Timeline

KHÔNG viết code.

Chỉ phân tích và lập kế hoạch triển khai Mobile App dựa trên source Frontend hiện tại.
