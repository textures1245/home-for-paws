import { z } from "zod";
import GeoJSON from "geojson";

type AllowedGeometry = GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon
>;

export const geometrySchema = z.object({
  type: z.literal("Feature"),
  properties: z.object({}),
  geometry: z.object({
    coordinates: z.number().array(),
    type: z.literal("Point"),
  }),
}) satisfies z.ZodType<AllowedGeometry>;
