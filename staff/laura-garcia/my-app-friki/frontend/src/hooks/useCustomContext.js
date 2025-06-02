import { createContext, useContext } from 'react';


export const customContext = createContext();

export default function useCustomContext() { return useContext(customContext) }