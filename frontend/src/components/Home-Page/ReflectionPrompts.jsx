import React from "react";
import { useReflectionPrompts } from "../../lib/reflectionPrompts";

export default function ReflectionPrompts() {
  const { prompts } = useReflectionPrompts();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-16">
      <h2 className="text-3xl font-semibold text-orange-500 mb-2">Reflection Prompts</h2>
      <p className="text-sm text-slate-600 mb-6">
        No need to type anything—read each question and reflect quietly.
      </p>

      <ol className="space-y-4 list-decimal list-inside">
        {prompts.map((q, i) => (
          <li key={i} className="text-lg text-slate-800">
            {q}
          </li>
        ))}
      </ol>
    </div>
  );
}
