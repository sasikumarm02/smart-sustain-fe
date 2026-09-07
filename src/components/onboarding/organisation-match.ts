/**
 * §12 duplicate-organisation constants and types.
 */

/**
 * Exact §12 wording, quoted verbatim from the requirements:
 *
 *   > Organisation already exists. Please confirm that you belong to this
 *   > organisation.
 *
 * Do not reword — §12 specifies this string and the applicant must see it
 * unchanged.
 */
export const ORGANISATION_MATCH_MESSAGE =
  "Organisation already exists. Please confirm that you belong to this organisation.";

/** Outcome of the §12 probe, as returned by checkOrganisationMatchAction. */
export interface OrganisationMatchResult {
  /** True when an existing organisation matched — show the §12 message. */
  matched: boolean;
  matchedName?: string;
  /** True when the match sits under the authority chosen in step 1. */
  sameAuthority?: boolean;
  /** Probe failed; step 2 stays usable and no §12 prompt is shown. */
  error?: string;
}
