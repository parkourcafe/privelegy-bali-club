import {
  isMobileSlug,
  mobileBootstrapDataSchema,
  mobileConfigDataSchema,
  mobileRouteDataSchema,
  mobileRoutesDataSchema,
  mobileVenueDataSchema,
  mobileVenuesDataSchema,
} from "./contracts";
import {
  mobileApiContractResponse,
  mobileApiError,
  mobileApiOptions,
  mobileApiSuccess,
} from "./http";
import {
  getMobileBootstrapData,
  getMobileConfigData,
  getMobileRouteData,
  getMobileRoutesData,
  getMobileVenueData,
  getMobileVenuesData,
} from "./service";
import { logRequestFailure } from "../server-log";

export const mobileOptions = mobileApiOptions;

export function mobileBootstrap(request: Request): Promise<Response> {
  return mobileApiContractResponse(request, mobileBootstrapDataSchema, getMobileBootstrapData);
}

export function mobileVenues(request: Request): Promise<Response> {
  return mobileApiContractResponse(request, mobileVenuesDataSchema, getMobileVenuesData);
}

export function mobileRoutes(request: Request): Promise<Response> {
  return mobileApiContractResponse(request, mobileRoutesDataSchema, getMobileRoutesData);
}

export function mobileConfig(request: Request): Promise<Response> {
  return mobileApiContractResponse(request, mobileConfigDataSchema, getMobileConfigData);
}

export async function mobileVenue(
  request: Request,
  params: Promise<{ slug: string }>,
): Promise<Response> {
  const { slug } = await params;
  if (!isMobileSlug(slug)) return mobileApiError("invalid_request", 400);
  try {
    const data = await getMobileVenueData(slug);
    return data
      ? mobileApiSuccess(request, data, mobileVenueDataSchema)
      : mobileApiError("not_found", 404);
  } catch {
    logRequestFailure(request, "mobile_api_load_failed");
    return mobileApiError("temporarily_unavailable", 503);
  }
}

export async function mobileRoute(
  request: Request,
  params: Promise<{ slug: string }>,
): Promise<Response> {
  const { slug } = await params;
  if (!isMobileSlug(slug)) return mobileApiError("invalid_request", 400);
  try {
    const data = await getMobileRouteData(slug);
    return data
      ? mobileApiSuccess(request, data, mobileRouteDataSchema)
      : mobileApiError("not_found", 404);
  } catch {
    logRequestFailure(request, "mobile_api_load_failed");
    return mobileApiError("temporarily_unavailable", 503);
  }
}
