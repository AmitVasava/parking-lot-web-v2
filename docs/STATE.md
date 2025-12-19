# Parking Lot – State Model (Phase A)

## Purpose

This document defines the **state transitions** for the Parking Lot system.
It supports the already finalized **flows** and does not introduce new behavior.

Scope is intentionally minimal.

---

## 1. Spot State Model

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

### Transitions

| From      | Action         | To        |
| --------- | -------------- | --------- |
| Available | Park Vehicle   | Occupied  |
| Occupied  | Unpark Vehicle | Available |

### Rules (Invariants)

- A spot can have **at most one active ticket**
- A spot **cannot be parked** if already Occupied
- A spot **cannot be unparked** if already Available
- Spot state changes only through Park / Unpark flows

---

## 2. Ticket State Model

### States

- None (implicit)
- Active
- Closed

### State Description

- **None**

  - No ticket exists for the spot

- **Active**

  - Ticket created during Park Vehicle
  - Vehicle is currently parked

- **Closed**
  - Ticket closed during Unpark Vehicle
  - Parking session completed

### Transitions

| From   | Action         | To     |
| ------ | -------------- | ------ |
| None   | Park Vehicle   | Active |
| Active | Unpark Vehicle | Closed |

### Rules (Invariants)

- A ticket is created **only during Park**
- A ticket can be closed **only once**
- A Closed ticket **cannot return** to Active
- Each ticket belongs to exactly one Spot and Floor

---

## 3. Invoice State Model

### States

- None (implicit)
- Generated

### State Description

- **None**

  - No invoice exists for the ticket

- **Generated**
  - Invoice created after Unpark
  - Invoice is immutable

### Transitions

| From | Action           | To        |
| ---- | ---------------- | --------- |
| None | Generate Invoice | Generated |

### Rules (Invariants)

- Exactly **one invoice per ticket**
- Invoice is generated **only after ticket is Closed**
- Invoice data **cannot be modified**
- Invoice generation does not affect Spot state

---

## 4. Cross-Entity Consistency Rules

These rules must always hold true:

- Spot is Occupied **iff** there exists an Active Ticket
- Ticket is Closed **iff** Invoice is Generated
- No Invoice can exist without a Ticket
- No Active Ticket can exist without an Occupied Spot

---

## 5. Phase A Guarantees

- Deterministic state transitions
- No cyclic lifecycles
- No hidden or implicit states
- Safe foundation for implementation

---

## Out of Scope (Phase A)

- Ticket re-opening
- Spot deletion with historical tickets
- Invoice regeneration
- Refunds or adjustments
