# SkyPlan — Authorization Matrix

## 1. Roles

The proposal identifies:
- Guest
- Registered User
- Admin

## 2. Access Matrix

| Capability | Guest | User | Admin |
|---|:---:|:---:|:---:|
| Access public interface | Yes | Yes | Yes |
| Search weather | Yes, limited | Yes | Yes |
| View multi-day forecast | Yes, within guest limitations | Yes | Yes |
| Receive activity recommendations | Yes, where search is available | Yes | Yes |
| Manage profile | No | Yes | Yes, for own account |
| Manage interests | No | Yes | Yes, for own account |
| Save favorites | No | Yes | Yes |
| View personal search history | No | Yes | Yes, for own account |
| Access admin dashboard | No | No | Yes |
| View usage statistics | No | No | Yes |
| View search logs | No | No | Yes |
| View popular searches | No | No | Yes |
| Configure recommendation rules | No | No | Yes |
| Manage users/system parameters | No | No | Yes |

## 3. Authorization Principles

1. Guest restrictions must be enforced by the backend where persistence or protected resources are involved.
2. User-owned resources must be checked against the authenticated user's identity.
3. Admin endpoints must require verified administrator authorization.
4. The frontend may hide unavailable controls, but hiding a button is not an authorization mechanism.
5. Never trust a role value supplied only by the client.

## 4. Guest Limit Definition

The proposal states that guest access is limited but does not define the exact numeric or time-based limitation.

Therefore:

**Do not hard-code an arbitrary guest quota until the team explicitly decides the policy.**
