// src/lib/reflectionPrompts.js
import { useEffect, useState } from "react";

export const DEFAULT_PROMPTS = [
  "How does Philippians 4:13 speak to a challenge you’re facing?",
  "Where do you need Christ’s strength today?",
  "What’s one practical step you can take this week in light of the verse?",
  "Recall a time you felt God’s strength. What can you carry forward?",
];

export function useReflectionPrompts() {
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);

  // If you ever decide to source prompts elsewhere, you can set them here.
  useEffect(() => {
    setPrompts(DEFAULT_PROMPTS);
  }, []);

  return { prompts };
}
