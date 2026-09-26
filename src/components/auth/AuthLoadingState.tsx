import React from 'react';

export const AuthLoadingState: React.FC<{ message?: string }> = ({
  message = 'Authenticating session...',
}) => {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-[rgba(20,20,22,0.1)] border-t-[#8EA633] animate-spin" />
        <div className="text-center">
          <span className="text-sm font-semibold tracking-tight text-[#141416] block">
            MAVORA
          </span>
          <p className="text-xs text-[#575762] mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};
