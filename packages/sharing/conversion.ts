import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import z from "zod";
import { type Phrase } from "packages/builder/store";

interface JsonData {
  videoId: string;
  phrases: Phrase[];
}

const playerSchema = z.object({
  videoId: z.string(),
  phrases: z.array(
    z.object({
      idx: z.number(),
      startTime: z.number(),
      endTime: z.number(),
    }),
  ),
});

const env = process.env.NODE_ENV;

const baseUrl =
  env === "development"
    ? "http://localhost:3000"
    : "https://looplab-beta.vercel.app";

export const getPlayerUrl = (data: JsonData) => {
  try {
    const jsonData = playerSchema.parse(data);
    const jsonDataString = JSON.stringify(jsonData);
    const string = compressToEncodedURIComponent(jsonDataString);
    return `${baseUrl}/play?data=${string}`;
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const getBuilderUrl = (data: JsonData) => {
  try {
    const jsonData = playerSchema.parse(data);
    const jsonDataString = JSON.stringify(jsonData);
    const string = compressToEncodedURIComponent(jsonDataString);
    return `${baseUrl}/create?data=${string}`;
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const dataDecompress = (compressed: string) => {
  try {
    const jsonDataString = decompressFromEncodedURIComponent(compressed);
    const validated = playerSchema.parse(JSON.parse(jsonDataString));
    console.log(JSON.stringify(validated));
    return playerSchema.parse(validated);
  } catch (e) {
    console.error(e);
    return null;
  }
};
