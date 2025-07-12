"use server";

import { suggestSkills } from "@/ai/flows/suggest-skills";
import type { SuggestSkillsOutput } from "@/ai/flows/suggest-skills";

interface FormState {
  data: SuggestSkillsOutput | null;
  error: string | null;
}

export async function getSkillSuggestions(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const skillDescription = formData.get("skillDescription") as string;

  if (!skillDescription || skillDescription.trim().length < 10) {
    return {
      data: null,
      error: "Please provide a more detailed description of your skill (at least 10 characters).",
    };
  }

  try {
    const result = await suggestSkills({ skillDescription });
    return {
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("Error in getSkillSuggestions action:", error);
    return {
      data: null,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
