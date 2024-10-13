import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface IappState {
    tmpFoodPhotoChange: boolean,

}

const appState: IappState = {
    tmpFoodPhotoChange: false
}

const createSetStateByKey = <STATETYPE,>(setter: Dispatch<SetStateAction<STATETYPE>>) => {
    return <K extends keyof STATETYPE>(key: K, value: STATETYPE[K]) => {
        setter((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
};

// Create context for appState
const AppStateContext = createContext<IappState & { setState: ReturnType<typeof createSetStateByKey<IappState>> } | undefined>(undefined);

// Create provider for appState
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<IappState>(appState);
    useEffect(() => {
        console.log("!state", state);
    }, [state]);
    return (
        <AppStateContext.Provider value={{ ...state, setState: createSetStateByKey<IappState>(setState) }}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error("useAppState must be used within an AppStateProvider");
    }
    return context;
};