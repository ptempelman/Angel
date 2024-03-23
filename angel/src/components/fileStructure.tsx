import React from 'react';

export interface FileItem { // Export this interface to use in other files
  name: string;
  type: 'file' | 'folder';
  highestSeverity: 'critical' | 'moderate' | 'minor' | 'none';
  children?: FileItem[];
}

interface FileStructureProps {
  structure: FileItem[];
}

const FileStructure: React.FC<FileStructureProps> = ({ structure }) => {
  return (
    <div>
      {structure.map((item, index) => (
        <div key={index} className="pl-4">
          <div className={`flex items-center ${item.type === 'folder' ? 'font-bold' : ''}`}>
            {item.type === 'folder' ? <span>📁</span> : <span>📄</span>}
            <span className="ml-2 text-white">{item.name}</span>
            <span className={`ml-2 ${getColor(item.highestSeverity)}`}>⬤</span>
          </div>
          {item.type === 'folder' && item.children && <FileStructure structure={item.children} />}
        </div>
      ))}
    </div>
  );
};

function getColor(severity: 'critical' | 'moderate' | 'minor' | 'none'): string {
  switch (severity) {
    case 'critical':
      return 'text-red-500';
    case 'moderate':
      return 'text-yellow-500';
    case 'minor':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

export default FileStructure;
