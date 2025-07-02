import React from 'react';
import { Info } from 'lucide-react';

interface InfoNoticeProps {
  message: string;
}

const InfoNotice: React.FC<InfoNoticeProps> = ({ message }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-blue-800 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoNotice;