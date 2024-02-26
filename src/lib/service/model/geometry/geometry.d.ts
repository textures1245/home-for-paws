import { z } from "zod";
import GeoJSON from "geojson";

type AllowedGeometry = GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon
>;

export const geometrySchema = z.object({
  type: z.literal("Feature"),
  properties: z.object({
    altitude: z.number().optional(),
    accuracy: z.number().optional(),
    speed: z.number().optional(),
    heading: z.number().optional(),
    altitudeAccuracy: z.number().optional(),
  }),
  geometry: z.object({
    coordinates: z.number().array(),
    type: z.literal("Point"),
  }),
}) satisfies z.ZodType<AllowedGeometry>;
