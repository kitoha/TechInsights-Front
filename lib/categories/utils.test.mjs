import assert from "node:assert/strict";
import test from "node:test";
import { formatCategoryDate, sortCategoriesByActivity } from "./utils.ts";

test("formatCategoryDate formats ISO date as Korean year-month-day", () => {
  assert.equal(formatCategoryDate("2025-12-25T09:30:00+09:00"), "2025년 12월 25일");
});

test("formatCategoryDate uses fixed Asia/Seoul timezone", () => {
  assert.equal(formatCategoryDate("2025-12-24T15:30:00.000Z"), "2025년 12월 25일");
});

test("formatCategoryDate returns dash for invalid date", () => {
  assert.equal(formatCategoryDate("not-a-date"), "-");
});

test("sortCategoriesByActivity sorts by views, posts, latest date, then name", () => {
  const categories = [
    {
      id: "b",
      name: "BackEnd",
      postCount: 100,
      totalViews: 10,
      latestPost: "2025년 1월 2일",
      latestPostDate: "2025-01-02T00:00:00",
    },
    {
      id: "a",
      name: "Architecture",
      postCount: 100,
      totalViews: 10,
      latestPost: "2025년 1월 2일",
      latestPostDate: "2025-01-02T00:00:00",
    },
    {
      id: "i",
      name: "Infra",
      postCount: 82,
      totalViews: 10,
      latestPost: "2025년 1월 3일",
      latestPostDate: "2025-01-03T00:00:00",
    },
    {
      id: "f",
      name: "FrontEnd",
      postCount: 120,
      totalViews: 12,
      latestPost: "2024년 12월 30일",
      latestPostDate: "2024-12-30T00:00:00",
    },
  ];

  const sorted = sortCategoriesByActivity(categories);
  assert.deepEqual(
    sorted.map((category) => category.id),
    ["f", "a", "b", "i"],
  );
});

test("sortCategoriesByActivity does not mutate the original array", () => {
  const categories = [
    {
      id: "a",
      name: "AI",
      postCount: 5,
      totalViews: 1,
      latestPost: "2024년 1월 1일",
      latestPostDate: "2024-01-01T00:00:00",
    },
    {
      id: "b",
      name: "BackEnd",
      postCount: 10,
      totalViews: 2,
      latestPost: "2024년 1월 2일",
      latestPostDate: "2024-01-02T00:00:00",
    },
  ];

  const originalOrder = categories.map((category) => category.id);
  sortCategoriesByActivity(categories);
  assert.deepEqual(
    categories.map((category) => category.id),
    originalOrder,
  );
});

test("sortCategoriesByActivity places invalid latestPostDate after valid dates", () => {
  const categories = [
    {
      id: "invalid",
      name: "InvalidDate",
      postCount: 100,
      totalViews: 10,
      latestPost: "-",
      latestPostDate: "not-a-date",
    },
    {
      id: "valid-new",
      name: "ValidNew",
      postCount: 100,
      totalViews: 10,
      latestPost: "2025년 1월 3일",
      latestPostDate: "2025-01-03T00:00:00",
    },
    {
      id: "valid-old",
      name: "ValidOld",
      postCount: 100,
      totalViews: 10,
      latestPost: "2025년 1월 2일",
      latestPostDate: "2025-01-02T00:00:00",
    },
  ];

  const sorted = sortCategoriesByActivity(categories);
  assert.deepEqual(
    sorted.map((category) => category.id),
    ["valid-new", "valid-old", "invalid"],
  );
});
