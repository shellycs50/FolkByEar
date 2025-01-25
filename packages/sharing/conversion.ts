import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import z from "zod";
import { type BuilderStoreState } from "packages/builder/store";
// Define the type for the JSON data
interface Phrase {
  idx: number;
  startTime: number;
  endTime: number;
}

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
    : "https://folk-by-ear.vercel.app";

export const getPlayerUrl = (builder: BuilderStoreState) => {
  try {
    const jsonData = playerSchema.parse(builder);
    const jsonDataString = JSON.stringify(jsonData);
    const string = compressToEncodedURIComponent(jsonDataString);
    return `${baseUrl}/play?data=${string}`;
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const getBuilderUrl = (builder: BuilderStoreState) => {
  console.log(" me trying to work");
  try {
    const jsonData = playerSchema.parse(builder);
    const jsonDataString = JSON.stringify(jsonData);
    const string = compressToEncodedURIComponent(jsonDataString);
    return `${baseUrl}/create?data=${string}`;
  } catch (e) {
    console.log("faiaaiaialkure");
    console.error(e);
    return "";
  }
};

export const dataDecompress = (compressed: string) => {
  try {
    const jsonDataString = decompressFromEncodedURIComponent(compressed);
    console.log({ jsonDataString });
    const validated = playerSchema.parse(JSON.parse(jsonDataString));
    console.log("successfully parsed");
    return playerSchema.parse(validated);
  } catch (e) {
    console.log("failed to parse");
    console.error(e);
    return null;
  }
};
