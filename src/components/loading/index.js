import React from "react";

const Loading = () => {
  return (
    <div
      id="loading-container"
      className="fixed top-0 left-0 w-full h-full bg-white/70 flex justify-center items-center z-[70] "
    >
      <div className='w-12 h-12 border-8 border-dashed rounded-full animate-spin  border-secondary'></div>
    </div>
  );
};

export default Loading;
