import React, { createContext, useState } from 'react';

export const NightModeContext = createContext();

export const NightModeProvider = ({ children }) => {
 const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
        setIsNightMode((prevMode) => !prevMode);
    };

    return (
        <NightModeContext.Provider value={{ isNightMode, toggleNightMode }}>
            {children}
        </NightModeContext.Provider>
    );
};
