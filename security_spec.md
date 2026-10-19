# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Strict Ownership (`ownerId == userId == request.auth.uid`)**: Every `/users/{userId}` document belongs exclusively to the authenticated user whose UID matches `{userId}` and `data.ownerId`.
2. **Email Verification Gate**: All writes require `request.auth != null && request.auth.token.email_verified == true`.
3. **No PII Storage & No Blanket Reads**: No email addresses, phone numbers, or physical addresses are stored in `/users/{userId}`. Only `get` by the document owner is permitted (`list` is denied).
4. **Strict Volumetric & Schema Bounds**:
   - `userId` and `ownerId`: `^[a-zA-Z0-9_\-]+$`, max 128 chars.
   - `displayName`: string, 1..80 chars.
   - `favoriteDrivers`: list, max 25 items; if non-empty, first element must be a string <= 64 chars.
   - `favoriteTeams`: list, max 15 items; if non-empty, first element must be a string <= 64 chars.
   - `units`: string, must be `'metric'` or `'imperial'`.
   - `defaultSeason`: int, between 1950 and 2030.
   - `createdAt` & `updatedAt`: server timestamps (`request.time`), with `createdAt` and `ownerId` immutable on update.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: `request.auth == null` attempting `create` on `/users/user_1`.
2. **Unverified Email Spoof**: `request.auth.token.email_verified == false` attempting `create` on `/users/user_1`.
3. **Cross-User Identity Spoofing**: `user_2` attempting `create` or `update` on `/users/user_1`.
4. **Mismatched `ownerId` Payload**: `user_1` creating `/users/user_1` with `ownerId: "user_2"`.
5. **Shadow / Ghost Field Injection**: `user_1` sending `{ ..., "isAdmin": true }` on `create` or `update`.
6. **ID Poisoning**: Path `/users/invalid$id!with@spaces` or > 128 chars.
7. **Oversized `displayName`**: `displayName` of 5,000 characters.
8. **Unbounded `favoriteDrivers` Array**: `favoriteDrivers` with 100 elements (> 25 limit).
9. **Type Poisoning in `favoriteDrivers`**: `favoriteDrivers: [12345]` (non-string element).
10. **Invalid Enum for `units`**: `units: "parsecs"`.
11. **Immutable Field Mutation**: Updating `createdAt` or `ownerId` on `/users/user_1`.
12. **Client-Forged Timestamp**: Setting `updatedAt` to a past or future timestamp instead of `request.time`.
