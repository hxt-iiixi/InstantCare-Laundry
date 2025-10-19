import React from "react";

const ReflectionPrompts = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-16">
      <h2 className="text-3xl font-semibold text-orange-500 mb-6">Reflection Prompts</h2>
      <p className="text-lg mb-6">Take a moment to reflect on today’s message.</p>

      <div className="space-y-6">
        <div>
          <label className="block font-semibold text-lg">
            1. How does Philippians 4:13 resonate with your current life challenges?
          </label>
          <textarea
            className="w-full mt-2 p-4 border rounded-md"
            rows="4"
            placeholder="Write your thoughts here..."
          />
        </div>

        <div>
          <label className="block font-semibold text-lg">
            2. What specific areas of your life do you need Christ’s strength today?
          </label>
          <textarea
            className="w-full mt-2 p-4 border rounded-md"
            rows="4"
            placeholder="Write your thoughts here..."
          />
        </div>

        <div>
          <label className="block font-semibold text-lg">
            3. How can you practically apply this verse to overcome a difficulty this week?
          </label>
          <textarea
            className="w-full mt-2 p-4 border rounded-md"
            rows="4"
            placeholder="Write your thoughts here..."
          />
        </div>

        <div>
          <label className="block font-semibold text-lg">
            4. Consider a time when you felt God’s strength. How can you carry that experience forward?
          </label>
          <textarea
            className="w-full mt-2 p-4 border rounded-md"
            rows="4"
            placeholder="Write your thoughts here..."
          />
        </div>
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
