import React from "react";
import { useReflectionPrompts } from "../../lib/reflectionPrompts"; // adjust path

const ReflectionPrompts = () => {
  const { prompts } = useReflectionPrompts();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-16">
      <h2 className="text-3xl font-semibold text-orange-500 mb-6">Reflection Prompts</h2>
      <p className="text-lg mb-6">Take a moment to reflect on today’s message.</p>

      <div className="space-y-6">
        {prompts.map((q, i) => (
          <div key={i}>
            <label className="block font-semibold text-lg">
              {i + 1}. {q}
            </label>
            <textarea
              className="w-full mt-2 p-4 border rounded-md"
              rows="4"
              placeholder="Write your thoughts here..."
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600">
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ReflectionPrompts;
