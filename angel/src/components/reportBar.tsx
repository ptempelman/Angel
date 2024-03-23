import React from 'react';
import fakeData from "../../one_file_analysis_report.json";

interface Report {
  title?: string;
  critical?: string;
  moderate?: string;
  minor?: string;
}

export const LeftBar = () => {
  return (
    <aside className="w-1/4 h-full overflow-y-auto bg-[#2e026d] p-4">
      {fakeData.map((report: Report, index: number) => (
        <button key={index} className="w-full mb-2 rounded p-2 text-left text-white bg-purple-600 hover:bg-purple-700">
          {report.title || `Report ${index + 1}`}
        </button>
      ))}
    </aside>
  );
};

export default LeftBar;
