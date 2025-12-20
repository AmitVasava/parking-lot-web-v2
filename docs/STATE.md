# Parking Lot – State Model (Phase A – Park Vehicle Only)

## Purpose

This document defines the **state transitions strictly required for the Park Vehicle flow**.
It intentionally excludes future flows (Unpark, Invoice) to keep scope minimal and safe.

This file will be **extended incrementally** as new flows are validated.

---

## 1. ParkingSpot State Model

### States

- Available
- Occupied

### State Description

- **Available**

  - Spot is free
  - No active ticket exists for this spot

- **Occupied**
  - Vehicle is parked
  - Exactly one active ticket exists

### Transitions (Park Vehicle Only)

| From      | Action       | To       |
| --------- | ------------ | -------- |
| Available | Park Vehicle | Occupied |

### Rules (Invariants)

- A spot can have **at most one active ticket**
- A spot **cannot be parked** if already Occupied
- Spot state changes **only through the Park Vehicle flow** (in this phase)

---

## 2. Ticket State Model

### States

- None (implicit)
- Active

### State Description

- **None**

  - No ticket exists

- **Active**
  - Ticket created during Park Vehicle
  - Represents an ongoing parking session

### Transitions (Park Vehicle Only)

| From | Action       | To     |
| ---- | ------------ | ------ |
| None | Park Vehicle | Active |

### Rules (Invariants)

- A ticket is created **only during Park Vehicle**
- A ticket can be **Active only once**
- Each Active ticket belongs to **exactly one ParkingSpot**

---

## 3. Cross-Entity Consistency Rules

These rules must **always hold true** during Park Vehicle:

- A ParkingSpot is Occupied **iff** there exists an Active Ticket
- An Active Ticket **must reference** an Occupied ParkingSpot
- No partial state is allowed:
  - Ticket creation and Spot occupation happen **together**
  - Either both succeed or neither does

---

## Phase A (Park Vehicle) Guarantees

- Deterministic state transitions
- No unreachable states
- No premature future assumptions
- Safe, boring foundation for implementation

---

## Explicitly Out of Scope (This Phase)

- Unpark Vehicle flow
- Ticket Closed state
- Invoice generation
- Pricing, payments, or timing rules
