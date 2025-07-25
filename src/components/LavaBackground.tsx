import React from 'react';

const LavaBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-20" />
      
      {/* Animated lava blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-radial from-primary to-transparent rounded-full animate-lava-1 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-radial from-secondary to-transparent rounded-full animate-lava-2 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-radial from-primary to-transparent rounded-full animate-lava-3 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-secondary to-transparent rounded-full animate-lava-1 blur-2xl opacity-50" />
      
      {/* Additional organic shapes */}
      <div className="absolute top-20 right-1/4 w-40 h-60 bg-gradient-to-t from-primary to-transparent rounded-full animate-lava-2 blur-xl opacity-30 transform rotate-45" />
      <div className="absolute bottom-40 right-20 w-52 h-32 bg-gradient-to-l from-secondary to-transparent rounded-full animate-lava-3 blur-xl opacity-40 transform -rotate-12" />
    </div>
  );
};

export default LavaBackground;