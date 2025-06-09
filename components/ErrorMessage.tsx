
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div 
      role="alert" 
      className="glassmorphic-card shadow-2xl rounded-xl p-6 md:p-8 mt-8 w-full max-w-lg bg-red-500/30 border-red-500/50"
    >
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-300 mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <div>
          <h3 className="text-xl font-semibold text-red-100">Oops! An Error Occurred</h3>
          <p className="text-red-200 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
