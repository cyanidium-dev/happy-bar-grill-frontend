import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Menu documents require an authenticated Viewer token on this project.
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});
