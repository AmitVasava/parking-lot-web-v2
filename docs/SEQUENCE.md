# Parking Lot – Sequence Flows (Phase A)

## 1. Purpose

This document describes the runtime behavior and interaction flow of the Parking Lot application.

It focuses on:

- Park Vehicle flow
- Unpark Vehicle flow
- Invoice generation flow

Phase A assumptions:

- Frontend-only execution (Angular + Signal Store)
- Centralized Store acts as the system brain
- Ticket → Invoice lifecycle is immutable

---

## 2. Actors & Components

- Operator – Human user operating the parking system
- UI – Angular pages & components
- Dialog – Modal dialogs (Park / Unpark / Invoice)
- Store – ParkingLotStore (business orchestration)
- Domain – Domain models (Spot, Ticket, Invoice)

---

## 3. Park Vehicle Sequence

### Description

A vehicle arrives at the parking lot.
The operator parks the vehicle and a Ticket is created.
The Spot becomes Occupied.

```mermaid
sequenceDiagram
    actor Operator
    participant UI as Angular UI
    participant Dialog as Park Vehicle Dialog
    participant Store as ParkingLot Store
    participant Domain as Domain Models

    Operator ->> UI: Click "Park Vehicle"
    UI ->> Dialog: Open Park Dialog
    Operator ->> Dialog: Enter vehicle & driver details
    Dialog ->> Store: submitParkRequest()
    Store ->> Domain: Create Ticket
    Store ->> Domain: Mark Spot as Occupied
    Store -->> UI: Update UI State
```

Rules Enforced:

- Ticket is created only once
- Spot cannot be parked while occupied
- No invoice during parking

---

## 4. Unpark Vehicle Sequence

### Description

The operator unparks a vehicle.
The Ticket is closed and the Spot becomes Available.

```mermaid
sequenceDiagram
    actor Operator
    participant UI as Angular UI
    participant Dialog as Unpark Vehicle Dialog
    participant Store as ParkingLot Store
    participant Domain as Domain Models

    Operator ->> UI: Click "Unpark Vehicle"
    UI ->> Dialog: Open Unpark Dialog
    Operator ->> Dialog: Select payment method
    Dialog ->> Store: submitUnparkRequest()
    Store ->> Domain: Close Ticket
    Store ->> Domain: Mark Spot as Available
```

Rules Enforced:

- Only active tickets can be unparked
- Spot is freed after unpark

---

## 5. Invoice Generation Sequence

### Description

Invoice is generated exactly once after unpark.
Invoice is immutable.

```mermaid
sequenceDiagram
    participant Store as ParkingLot Store
    participant Domain as Domain Models
    participant Dialog as Invoice Dialog
    participant UI as Angular UI

    Store ->> Domain: Calculate duration & amount
    Store ->> Domain: Create Invoice
    Store ->> Dialog: Open Invoice Dialog
    Dialog -->> UI: Display Invoice
```

Rules Enforced:

- One invoice per ticket
- Invoice cannot be edited
- PDF generated on demand

---

## 6. State Transitions Summary

| Entity  | Before    | Action | After     |
| ------- | --------- | ------ | --------- |
| Spot    | Available | Park   | Occupied  |
| Ticket  | None      | Park   | Active    |
| Ticket  | Active    | Unpark | Closed    |
| Spot    | Occupied  | Unpark | Available |
| Invoice | None      | Unpark | Generated |

---

## 7. Phase A Guarantees

- Deterministic lifecycle
- Explicit state transitions
- Backend-ready design

---

## 8. Out of Scope

- Refunds or adjustments
- Re-opening tickets
- Audit logs
- Async backend workflows
