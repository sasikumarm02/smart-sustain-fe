import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  Card,
  MultiSelect,
  PrimaryButton,
  SecondaryButton,
  Select,
  SelectionSummary,
  Stepper,
  TextInput,
} from "../ui";
import {
  BuildingIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
} from "../ui/icons";
import { checkOrganisationMatchAction, submitOnboardingAction, type OrganisationOnboarding } from "./actions";
import {
  ORGANISATION_MATCH_MESSAGE,
  type OrganisationMatchResult,
} from "./organisation-match";
import {
  STATIC_MASTER_DATA,
  type AdminRow,
  type FacilitiesMode,
  type FacilityRow,
  type OnboardingMasterData,
} from "./wizard-types";

const STEPS = [
  { label: "Domain & Location" },
  { label: "Organisation Information" },
  { label: "Facilities" },
  { label: "Administrator" },
  { label: "Review & Save" },
];

const STEP_CONTENT: { title: string; description: string }[] = [
  {
    title: "Select your country, domain and city / organisation",
    description:
      "These selections help us drive the right frameworks, topics and reporting requirements.",
  },
  {
    title: "Tell us about your organisation",
    description:
      "Basic details used on reports. Only the name is required — you can refine the rest later.",
  },
  {
    title: "Set up your facilities",
    description:
      "Add the facilities emission data is collected for, or skip and add them later.",
  },
  {
    title: "Who administers this organisation?",
    description:
      "The administrator gets an activation email and can invite further users.",
  },
  {
    title: "Review your onboarding configuration",
    description:
      "Go back to any step to make changes, then save to create the organisation.",
  },
];

const ORG_SIZES = ["1-50", "51-200", "201-500", "501-1000", "1000+"];

let rowCounter = 0;
function newRow(): FacilityRow {
  rowCounter += 1;
  return { key: `row-${rowCounter}`, name: "", code: "", facilityTypeId: "", city: "" };
}

let adminCounter = 0;
function newAdminRow(): AdminRow {
  adminCounter += 1;
  return { key: `admin-${adminCounter}`, fullName: "", jobTitle: "", email: "", phone: "", facilityIds: [] };
}

/** Which wizard step a 422 field key belongs to. */
function stepForField(key: string): number {
  if (key.startsWith("administrator")) return 4;
  if (key.startsWith("facilities")) return 3;
  if (["countryId", "domainId", "cityOrAuthorityId"].includes(key)) return 1;
  return 2;
}

function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""),
  ) as Partial<T>;
}

export default function Wizard({
  masterData = STATIC_MASTER_DATA,
  onCompleteOnboarding,
}: {
  masterData?: OnboardingMasterData;
  onCompleteOnboarding?: () => void;
}) {
  const { fetchUserProfile } = useAuth();
  const { countries, domains, cities, sectors, subSectors, facilityTypes } =
    masterData;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>();
  const [createdOrgName, setCreatedOrgName] = useState<string>();

  // Step 1 — Domain & Location
  const [countryId, setCountryId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [cityOrAuthorityId, setCityOrAuthorityId] = useState("");

  // Step 2 — Organisation information
  const [name, setName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [orgMatch, setOrgMatch] = useState<OrganisationMatchResult>();

  async function probeOrganisationMatch() {
    if (!name.trim() && !registrationNumber.trim()) {
      setOrgMatch(undefined);
      return;
    }
    setOrgMatch(
      await checkOrganisationMatchAction({
        name,
        registrationNumber,
        authorityId: cityOrAuthorityId || undefined,
      }),
    );
  }
  const [sectorId, setSectorId] = useState("");
  const [subSectorId, setSubSectorId] = useState("");
  const [size, setSize] = useState("");
  const [employees, setEmployees] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 3 — Facilities
  const [facilitiesMode, setFacilitiesMode] = useState<FacilitiesMode>("single");
  const [rows, setRows] = useState<FacilityRow[]>([newRow()]);

  // Step 4 — Administrators
  const [adminRows, setAdminRows] = useState<AdminRow[]>([newAdminRow()]);

  function updateAdminRow(key: string, patch: Partial<AdminRow>) {
    setAdminRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row))
    );
  }

  function removeAdminRow(key: string) {
    setAdminRows((current) => current.filter((row) => row.key !== key));
  }

  const domain = useMemo(
    () => domains.find((d) => d.id === domainId),
    [domains, domainId],
  );
  const contextLabel = domain?.contextLabel ?? "Select City / Local Authority";
  const filteredCities = useMemo(
    () => (domainId ? cities.filter((c) => c.domainId === domainId) : []),
    [cities, domainId],
  );
  const filteredSubSectors = useMemo(
    () => (sectorId ? subSectors.filter((s) => s.sectorId === sectorId) : []),
    [subSectors, sectorId],
  );

  const nameOf = (items: { id: string; name: string }[], id: string) =>
    items.find((item) => item.id === id)?.name;

  const activeRows = facilitiesMode === "later" ? [] : rows;
  const rowsValid =
    activeRows.length > 0 &&
    activeRows.every((row) => row.name.trim() !== "" && row.code.trim() !== "");

  const facilityOptions = useMemo(() => {
    if (facilitiesMode !== "later" && activeRows.length > 0) {
      return activeRows.map((r, idx) => {
        const labelName = r.name.trim() || `Facility ${idx + 1}`;
        const labelCode = r.code.trim() ? ` (${r.code.trim()})` : "";
        return { id: r.key, name: `${labelName}${labelCode}` };
      });
    }
    return [
      { id: "hq", name: "HQ Building" },
      { id: "plant-1", name: "Primary Manufacturing Plant" },
      { id: "warehouse-1", name: "Central Warehouse" },
    ];
  }, [facilitiesMode, activeRows]);

  const canProceed = (() => {
    switch (step) {
      case 1:
        return countryId !== "" && domainId !== "" && cityOrAuthorityId !== "";
      case 2:
        return name.trim() !== "";
      case 3:
        return facilitiesMode === "later" ? true : rowsValid;
      case 4:
        return (
          adminRows.length > 0 &&
          adminRows.every(
            (admin) => admin.fullName.trim() !== "" && admin.email.trim() !== ""
          )
        );
      default:
        return true;
    }
  })();

  function updateRow(key: string, patch: Partial<FacilityRow>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row.key !== key));
  }

  function changeMode(mode: FacilitiesMode) {
    setFacilitiesMode(mode);
    setRows((current) => {
      if (mode === "single") return current.length > 0 ? [current[0]] : [newRow()];
      if (current.length === 0) return [newRow()];
      return current;
    });
  }

  function goNext() {
    if (!canProceed) return;
    setSubmitError(undefined);
    setStep((current) => Math.min(current + 1, STEPS.length));
  }

  function goBack() {
    setSubmitError(undefined);
    setStep((current) => Math.max(current - 1, 1));
  }

  function buildPayload(): OrganisationOnboarding {
    const profile = stripEmpty({
      size,
      employees,
      contactName,
      contactEmail,
      contactPhone,
    });
    return {
      countryId,
      domainId,
      ...stripEmpty({
        cityOrAuthorityId,
        registrationNumber,
        sectorId,
        subSectorId,
        website,
        address,
      }),
      name: name.trim(),
      profile: Object.keys(profile).length > 0 ? profile : undefined,
      facilities:
        facilitiesMode === "later"
          ? undefined
          : activeRows.map((row) => ({
              name: row.name.trim(),
              code: row.code.trim(),
              ...stripEmpty({ facilityTypeId: row.facilityTypeId, city: row.city }),
            })),
      administrators: adminRows.map(a => ({
        fullName: a.fullName.trim(),
        email: a.email.trim(),
        ...stripEmpty({ jobTitle: a.jobTitle, phone: a.phone }),
        facilityIds: a.facilityIds,
      })),
    };
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(undefined);
    setFieldErrors(undefined);
    const result = await submitOnboardingAction(buildPayload());
    setSubmitting(false);
    if (result.ok) {
      setCreatedOrgName(result.organisationName ?? name.trim());
      return;
    }
    setSubmitError(result.error);
    if (result.fields && Object.keys(result.fields).length > 0) {
      setFieldErrors(result.fields);
      const firstStep = Math.min(
        ...Object.keys(result.fields).map(stepForField),
      );
      setStep(firstStep);
    } else {
      setStep(5);
    }
  }

  /* ------------------------------ success ------------------------------ */
  if (createdOrgName) {
    return (
      <Card className="mx-auto max-w-xl py-10 text-center bg-white border border-slate-200 shadow-sm rounded-xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-[#25a5cb]">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          {createdOrgName} is ready
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
          The organisation was created together with its facilities and
          administrators. Activation emails are on their way.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={async () => {
              await fetchUserProfile();
              if (onCompleteOnboarding) {
                onCompleteOnboarding();
              } else {
                window.location.href = '/';
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25a5cb] hover:bg-[#1f93b5] active:bg-[#1a82a1] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Go to Dashboard
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.location.hash = '#context-picker'; }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
          >
            Switch Organisation
          </a>
        </div>
      </Card>
    );
  }

  /* ------------------------------- wizard ------------------------------ */
  return (
    <div className="space-y-6">
      <Card className="py-4 px-6 bg-white border border-slate-200 shadow-sm rounded-xl">
        <Stepper steps={STEPS} currentStep={step} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#1d769f]">
              Step {step} of {STEPS.length}
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              {STEP_CONTENT[step - 1].title}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {STEP_CONTENT[step - 1].description}
            </p>

            {submitError ? (
              <div
                role="alert"
                className="mt-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
              >
                <p className="font-semibold">{submitError}</p>
                {fieldErrors ? (
                  <ul className="mt-1 list-inside list-disc font-medium">
                    {Object.entries(fieldErrors).map(([key, message]) => (
                      <li key={key}>
                        <span className="text-red-800">{key}:</span> {message}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6">
              {step === 1 ? (
                <div className="space-y-5">
                  <Select
                    label="1. Select Country"
                    required
                    placeholder="Select country"
                    options={countries.map((c) => ({ value: c.id, label: c.name }))}
                    value={countryId}
                    onChange={(event: any) => {
                      setCountryId(event.target.value);
                      setCityOrAuthorityId("");
                    }}
                    error={fieldErrors?.countryId}
                  />
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      2. Select Domain<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {domains.map((d) => {
                        const selected = d.id === domainId;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            disabled={countryId === ""}
                            onClick={() => {
                              setDomainId(d.id);
                              setCityOrAuthorityId("");
                            }}
                            aria-pressed={selected}
                            className={`relative rounded-xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                              selected
                                ? "border-[#25a5cb] bg-cyan-50/70 ring-2 ring-cyan-500/20 shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            {selected ? (
                              <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#25a5cb] text-white">
                                <CheckIcon className="h-2.5 w-2.5" />
                              </span>
                            ) : null}
                            <BuildingIcon
                              className={`h-5 w-5 ${selected ? "text-[#25a5cb]" : "text-slate-400"}`}
                            />
                            <span className={`mt-2 block text-xs font-semibold ${selected ? "text-[#1d769f]" : "text-slate-700"}`}>
                              {d.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {fieldErrors?.domainId ? (
                      <p role="alert" className="mt-1 text-xs text-red-500 font-semibold">
                        {fieldErrors.domainId}
                      </p>
                    ) : null}
                  </div>
                  <Select
                    label={`3. ${contextLabel}`}
                    required
                    placeholder={
                      domainId ? "Select city / local authority" : "Select a domain first"
                    }
                    options={filteredCities.map((c) => ({ value: c.id, label: c.name }))}
                    value={cityOrAuthorityId}
                    onChange={(event: any) => setCityOrAuthorityId(event.target.value)}
                    disabled={domainId === ""}
                    error={fieldErrors?.cityOrAuthorityId}
                  />
                </div>
              ) : null}

            {step === 2 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {orgMatch?.matched ? (
                  <div
                    role="status"
                    className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 sm:col-span-2"
                  >
                    <p className="font-semibold">{ORGANISATION_MATCH_MESSAGE}</p>
                    {orgMatch.matchedName ? (
                      <p className="mt-1 font-medium text-amber-700">
                        Matched: {orgMatch.matchedName}
                        {orgMatch.sameAuthority
                          ? " (under the local authority you selected)"
                          : null}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {orgMatch?.error ? (
                  <p className="text-xs text-slate-500 sm:col-span-2">
                    {orgMatch.error}
                  </p>
                ) : null}
                <TextInput
                  label="Organisation Name"
                  required
                  value={name}
                  onChange={(event: any) => setName(event.target.value)}
                  onBlur={probeOrganisationMatch}
                  placeholder="e.g. Mindgraph Technologies"
                  error={fieldErrors?.name}
                  wrapperClassName="sm:col-span-2"
                />
                <TextInput
                  label="Registration Number"
                  value={registrationNumber}
                  onChange={(event: any) => setRegistrationNumber(event.target.value)}
                  onBlur={probeOrganisationMatch}
                  placeholder="e.g. MBMB-1992-001"
                  error={fieldErrors?.registrationNumber}
                />
                <Select
                  label="Organisation Size"
                  placeholder="Select size"
                  options={ORG_SIZES.map((s) => ({ value: s, label: `${s} employees` }))}
                  value={size}
                  onChange={(event: any) => setSize(event.target.value)}
                />
                <Select
                  label="Sector"
                  placeholder="Select sector"
                  options={sectors.map((s) => ({ value: s.id, label: s.name }))}
                  value={sectorId}
                  onChange={(event: any) => {
                    setSectorId(event.target.value);
                    setSubSectorId("");
                  }}
                  error={fieldErrors?.sectorId}
                />
                <Select
                  label="Sub-Sector"
                  placeholder={sectorId ? "Select sub-sector" : "Select a sector first"}
                  options={filteredSubSectors.map((s) => ({ value: s.id, label: s.name }))}
                  value={subSectorId}
                  onChange={(event: any) => setSubSectorId(event.target.value)}
                  disabled={sectorId === ""}
                  error={fieldErrors?.subSectorId}
                />
                <TextInput
                  label="Number of Employees"
                  type="number"
                  min={0}
                  value={employees}
                  onChange={(event: any) => setEmployees(event.target.value)}
                  placeholder="e.g. 250"
                />
                <TextInput
                  label="Website"
                  type="url"
                  value={website}
                  onChange={(event: any) => setWebsite(event.target.value)}
                  placeholder="https://example.org"
                  error={fieldErrors?.website}
                />
                <TextInput
                  label="Address"
                  value={address}
                  onChange={(event: any) => setAddress(event.target.value)}
                  placeholder="Street, postcode, city"
                  error={fieldErrors?.address}
                  wrapperClassName="sm:col-span-2"
                />
                <TextInput
                  label="Contact Name"
                  value={contactName}
                  onChange={(event: any) => setContactName(event.target.value)}
                />
                <TextInput
                  label="Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={(event: any) => setContactEmail(event.target.value)}
                />
                <TextInput
                  label="Contact Phone"
                  value={contactPhone}
                  onChange={(event: any) => setContactPhone(event.target.value)}
                />
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ["single", "Single Facility", "One site or building"],
                      ["multiple", "Multiple Facilities", "Several sites"],
                      ["later", "Add Later", "Skip for now"],
                    ] as [FacilitiesMode, string, string][]
                  ).map(([mode, title, subtitle]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => changeMode(mode)}
                      aria-pressed={facilitiesMode === mode}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        facilitiesMode === mode
                          ? "border-[#25a5cb] bg-cyan-50/70 ring-2 ring-cyan-500/20 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            facilitiesMode === mode
                              ? "border-[#25a5cb] bg-[#25a5cb]"
                              : "border-slate-300"
                          }`}
                        >
                          {facilitiesMode === mode ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          ) : null}
                        </span>
                        <span className={`text-xs font-semibold ${facilitiesMode === mode ? "text-[#1d769f]" : "text-slate-800"}`}>
                          {title}
                        </span>
                      </span>
                      <span className="mt-1 block pl-6 text-[11px] text-slate-400">
                        {subtitle}
                      </span>
                    </button>
                  ))}
                </div>

                {facilitiesMode === "later" ? (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
                    No problem — you can add facilities anytime from the
                    Facilities page after onboarding.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {rows.map((row, index) => (
                      <div
                        key={row.key}
                        className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            FACILITY {index + 1}
                          </p>
                          {facilitiesMode === "multiple" && rows.length > 1 ? (
                            <button
                              type="button"
                              aria-label={`Remove facility ${index + 1}`}
                              onClick={() => removeRow(row.key)}
                              className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <TextInput
                            label="Facility Name"
                            required
                            value={row.name}
                            onChange={(event: any) =>
                              updateRow(row.key, { name: event.target.value })
                            }
                            placeholder="e.g. HQ Building"
                          />
                          <TextInput
                            label="Facility Code"
                            required
                            value={row.code}
                            onChange={(event: any) =>
                              updateRow(row.key, { code: event.target.value })
                            }
                            placeholder="e.g. HQ-001"
                          />
                          <Select
                            label="Facility Type"
                            placeholder="Select type"
                            options={facilityTypes.map((t) => ({
                              value: t.id,
                              label: t.name,
                            }))}
                            value={row.facilityTypeId}
                            onChange={(event: any) =>
                              updateRow(row.key, {
                                facilityTypeId: event.target.value,
                              })
                            }
                          />
                          <TextInput
                            label="City"
                            value={row.city}
                            onChange={(event: any) =>
                              updateRow(row.key, { city: event.target.value })
                            }
                          />
                        </div>
                      </div>
                    ))}
                    {facilitiesMode === "multiple" ? (
                      <SecondaryButton onClick={() => setRows((c) => [...c, newRow()])}>
                        <PlusIcon className="h-3.5 w-3.5 mr-1" />
                        Add Facility
                      </SecondaryButton>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                {adminRows.map((admin, index) => (
                  <div
                    key={admin.key}
                    className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        ADMINISTRATOR {index + 1}
                      </p>
                      {adminRows.length > 1 ? (
                        <button
                          type="button"
                          aria-label={`Remove administrator ${index + 1}`}
                          onClick={() => removeAdminRow(admin.key)}
                          className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextInput
                        label="Full Name"
                        required
                        value={admin.fullName}
                        onChange={(event: any) =>
                          updateAdminRow(admin.key, { fullName: event.target.value })
                        }
                        placeholder="e.g. Jane Doe"
                        error={fieldErrors?.["administrator.fullName"]}
                      />
                      <TextInput
                        label="Job Title"
                        value={admin.jobTitle}
                        onChange={(event: any) =>
                          updateAdminRow(admin.key, { jobTitle: event.target.value })
                        }
                        placeholder="e.g. Sustainability Manager"
                        error={fieldErrors?.["administrator.jobTitle"]}
                      />
                      <TextInput
                        label="Email"
                        type="email"
                        required
                        value={admin.email}
                        onChange={(event: any) =>
                          updateAdminRow(admin.key, { email: event.target.value })
                        }
                        placeholder="name@organisation.org"
                        error={fieldErrors?.["administrator.email"]}
                      />
                      <TextInput
                        label="Phone"
                        type="tel"
                        value={admin.phone}
                        onChange={(event: any) =>
                          updateAdminRow(admin.key, { phone: event.target.value })
                        }
                        placeholder="+60 12 345 6789"
                        error={fieldErrors?.["administrator.phone"]}
                      />
                      <MultiSelect
                        label="Assigned Facilities (Multi-Select)"
                        options={facilityOptions}
                        value={admin.facilityIds}
                        onChange={(selected: string[]) =>
                          updateAdminRow(admin.key, { facilityIds: selected })
                        }
                        placeholder="Select assigned facilities..."
                        className="sm:col-span-2"
                      />
                    </div>
                  </div>
                ))}

                <SecondaryButton onClick={() => setAdminRows((c) => [...c, newAdminRow()])}>
                  <PlusIcon className="h-3.5 w-3.5 mr-1" />
                  Add Administrator
                </SecondaryButton>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-4">
                {(
                  [
                    {
                      title: "Domain & Location",
                      step: 1,
                      rows: [
                        ["Country", nameOf(countries, countryId)],
                        ["Domain", nameOf(domains, domainId)],
                        [contextLabel, nameOf(cities, cityOrAuthorityId)],
                      ],
                    },
                    {
                      title: "Organisation",
                      step: 2,
                      rows: [
                        ["Name", name],
                        ["Registration Number", registrationNumber],
                        ["Sector", sectorId ? nameOf(sectors, sectorId) : ""],
                        [
                          "Sub-Sector",
                          subSectorId ? nameOf(subSectors, subSectorId) : "",
                        ],
                        ["Size", size ? `${size} employees` : ""],
                        ["Employees", employees],
                        ["Website", website],
                        ["Address", address],
                      ],
                    },
                  ] as { title: string; step: number; rows: [string, string | undefined][] }[]
                ).map((section) => (
                  <div
                    key={section.title}
                    className="rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                      <h3 className="text-xs font-bold text-slate-800">
                        {section.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(section.step)}
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <dl className="grid gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2">
                      {section.rows
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                          <div key={label} className="flex gap-2 text-xs">
                            <dt className="w-36 shrink-0 text-slate-400">{label}</dt>
                            <dd className="font-semibold text-slate-800">{value}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                ))}

                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                    <h3 className="text-xs font-bold text-slate-800">
                      Administrators ({adminRows.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {adminRows.map((adm, idx) => (
                      <dl key={adm.key} className="grid gap-x-6 gap-y-2 px-4 py-3 sm:grid-cols-2 text-xs">
                        <div className="flex gap-2 sm:col-span-2 font-bold text-slate-900 border-b border-slate-50 pb-1">
                          Administrator {idx + 1}: {adm.fullName || "—"}
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-28 shrink-0 text-slate-400">Email</dt>
                          <dd className="font-semibold text-slate-800">{adm.email || "—"}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-28 shrink-0 text-slate-400">Job Title</dt>
                          <dd className="font-semibold text-slate-800">{adm.jobTitle || "—"}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-28 shrink-0 text-slate-400">Phone</dt>
                          <dd className="font-semibold text-slate-800">{adm.phone || "—"}</dd>
                        </div>
                        <div className="flex gap-2 sm:col-span-2">
                          <dt className="w-28 shrink-0 text-slate-400">Facilities</dt>
                          <dd className="font-semibold text-slate-800">
                            {adm.facilityIds.length > 0
                              ? facilityOptions
                                  .filter((f) => adm.facilityIds.includes(f.id))
                                  .map((f) => f.name)
                                  .join(", ")
                              : "All facilities"}
                          </dd>
                        </div>
                      </dl>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                    <h3 className="text-xs font-bold text-slate-800">
                      Facilities
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  {facilitiesMode === "later" ? (
                    <p className="px-4 py-3 text-xs text-slate-400">
                      Add later — no facilities will be created now.
                    </p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="px-4 py-2 font-medium">Name</th>
                          <th className="px-4 py-2 font-medium">Code</th>
                          <th className="px-4 py-2 font-medium">Type</th>
                          <th className="px-4 py-2 font-medium">City</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeRows.map((row) => (
                          <tr key={row.key} className="border-b border-slate-100 last:border-b-0">
                            <td className="px-4 py-2 font-semibold text-slate-800">
                              {row.name}
                            </td>
                            <td className="px-4 py-2 text-slate-600">{row.code}</td>
                            <td className="px-4 py-2 text-slate-600">
                              {nameOf(facilityTypes, row.facilityTypeId) ?? "—"}
                            </td>
                            <td className="px-4 py-2 text-slate-600">
                              {row.city || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          </div>

          {/* Step navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
            {step > 1 ? (
              <SecondaryButton onClick={goBack} disabled={submitting}>
                Back
              </SecondaryButton>
            ) : (
              <span />
            )}
            {step < STEPS.length ? (
              <PrimaryButton onClick={goNext} disabled={!canProceed}>
                Next
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving…" : "Save & Complete"}
              </PrimaryButton>
            )}
          </div>
        </Card>

        {/* Right rail */}
        <SelectionSummary
          items={[
            { label: "Country", value: nameOf(countries, countryId) ?? "—" },
            { label: "Domain", value: nameOf(domains, domainId) ?? "—" },
            {
              label: contextLabel,
              value: nameOf(cities, cityOrAuthorityId) ?? "—",
            },
            { label: "Organisation", value: name.trim() || "—" },
            {
              label: "Facilities",
              value:
                facilitiesMode === "later"
                  ? "Add later"
                  : `${activeRows.length} ${activeRows.length === 1 ? "facility" : "facilities"}`,
            },
            { label: "Emission Factor DB", value: "Not configured" },
          ]}
          status={
            step === STEPS.length
              ? { label: "Ready to Save", variant: "for-review" }
              : { label: "In Progress", variant: "draft" }
          }
        />
      </div>
    </div>
  );
}
