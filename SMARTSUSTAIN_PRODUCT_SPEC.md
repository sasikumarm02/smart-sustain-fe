# SmartSustain.AI — Monolithic React Application Specifications

**Document Version:** 1.0.0  
**Target Platform:** Enterprise Monolithic ESG & Carbon Accounting Dashboard  
**Architecture Model:** Monolithic Frontend with Unified State, Multi-Tenancy Context, and ESG Emission Calculators.

---

## 1. System Overview & Architecture

SmartSustain.AI is a comprehensive Enterprise ESG & Carbon Accounting platform built as a **Monolithic React Application** targeting full coverage across authentication, organisation tenancy, facility management, dynamic ESG questions, Scope 1/2/3 GHG calculations, review state workflows, and executive analytics.

### Unified API Architecture & Contexts:
- **`AuthContext`**: Manages user session, JWT credentials, current organisation (`currentOrganisationId`), active facility (`activeFacilityId`), role (`SUPER_ADMIN`, `DATA_PROVIDER`, `DATA_REVIEWER`), and active organisation switching (`POST /api/v1/auth/switch-organisation`).
- **`TenantContext`**: Manages facility hierarchy (1 Org -> N Facilities) and auto-provisions default Headquarters facility if none exist (`<ORG_PREFIX>-FAC-<4_HEX>`).
- **`EmissionContext`**: Serves as the central state engine handling Scope 1, Scope 2, and Scope 3 activity data entries, GHG calculation traces ($tCO_2e$), review state transitions (`DRAFT` -> `SUBMITTED` -> `UNDER_REVIEW` -> `APPROVED` / `REJECTED`), and segregation of duty validation.
- **`ConfigContext`**: Controls master framework standards (GRI, ISSB, BRSR, GHG Protocol), emission factor datasets (IPCC AR6, UK DEFRA, India CEA grid factor), unit conversions, and question bank definitions.

---

## 2. Segregation of Duties & RBAC Rules

```
+------------------+-----------------------------------------------------------------------------------+
| Role             | Permissions & Boundaries                                                          |
+------------------+-----------------------------------------------------------------------------------+
| SUPER_ADMIN      | Platform-wide configuration, master question bank, emission factor overrides,     |
|                  | organisation provisioning, reviewer assignments, global regulatory audit logs.    |
+------------------+-----------------------------------------------------------------------------------+
| DATA_PROVIDER    | Default role on registration. Ingests facility activity data (Scope 1, 2, 3),    |
|                  | answers framework questions, runs GHG calculations, submits data for review.       |
|                  | STRICT BOUNDARY: Cannot approve or reject data.                                   |
+------------------+-----------------------------------------------------------------------------------+
| DATA_REVIEWER    | Assigned per facility/organisation by Super Admin. Inspects submitted data,       |
|                  | validates calculation traces, approves (locks records) or rejects (with feedback).|
|                  | STRICT BOUNDARY: Cannot modify raw activity data; cannot approve own submissions. |
+------------------+-----------------------------------------------------------------------------------+
```

---

## 3. Universal Response Protocol (`CommonResponse`)

All API interactions strictly consume and format responses using the enterprise standard structure:

```json
{
  "status": "OK",
  "response": {
    "action": "FacilityListView",
    "data": []
  },
  "message": "Facilities retrieved successfully"
}
```

---

## 4. Key Application Views & Workflows

1. **Authentication & Multi-Tenant Navbar**:
   - Interactive Organisation Context Switcher.
   - Active Facility dropdown selector.
   - Role indicator badge (`SUPER_ADMIN`, `DATA_PROVIDER`, `DATA_REVIEWER`).

2. **Organisations & Facilities Management**:
   - Organization onboarding and facility provisioning.
   - Facility hierarchy list with default HQ auto-provisioning.
   - Reviewer assignment modal.

3. **Master Configuration Engine**:
   - ESG Reporting Frameworks (GRI Standards, ISSB S1/S2, BRSR, GHG Protocol).
   - Master Question Bank (Categorized by Scope 1, 2, 3, Water, Waste, Governance).
   - Emission Factors library (DEFRA, IPCC AR6, CEA CO2 baseline grid factor).

4. **Emission Ingestion & GHG Calculation Engine**:
   - Scope 1: Fuel Combustion, Fleet Mobile, Refrigerants.
   - Scope 2: Purchased Electricity (Location & Market based grid factors).
   - Scope 3: Business Travel, Employee Commute, Waste, Supply Chain Freight.
   - Instant calculation engine with transparent emission audit traces ($tCO_2e$).

5. **Centralized Review & Approval State Machine**:
   - Segregation of duties enforcement (No self-approval, minimum 10 char rejection remark, locked upon approval).
   - Review workflow (`DRAFT` -> `SUBMITTED` -> `UNDER_REVIEW` -> `APPROVED` / `REJECTED`).

6. **Executive ESG Analytics & Audit Trail**:
   - Dynamic rollups across facilities, scopes, and reporting years.
   - Filterable Audit Logs Explorer (`GET /api/v1/audit-logs`) with trace IDs, event severity, and JSON differential view.
