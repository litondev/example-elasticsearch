import { createContext, useContext } from 'react';

const AppContext = createContext({
  auth : null,
  testing : null
});

export function AppWrapper({ children,user }) {  
  let myContext = {
    auth : user,
    testing : 'holla'
  }  
  
  return (
    <AppContext.Provider 
      value={myContext}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContext;
