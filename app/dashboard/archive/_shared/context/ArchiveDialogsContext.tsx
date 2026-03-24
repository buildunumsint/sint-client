"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";



interface ArchiveDialogsContextType {
    createSacrament: {

        isOpen: boolean;
        onOpenChange: (open: boolean, sacramentType?: SacramentType | null) => void;
        sacramentType: SacramentType | null;
    }
    editSacrament: {
        isOpen: boolean;
        initialValues: any;
        onOpenChange: (open: boolean, sacramentType?: SacramentType | null, initialValues?: any) => void;
        sacramentType: SacramentType | null;
    }
    createParish: {
        isOpen: boolean;
        onOpenChange: (open: boolean) => void;
    }

}

type ArchiveDialogsState = {
    createSacramentOpen: boolean;
    sacramentType: SacramentType | null;
    editSacramentOpen: boolean;
    editSacramentType: SacramentType | null;
    editSacramentInitialValues: any;
    createParishOpen: boolean;
};

type ArchiveDialogsAction =
    | {
        type: "SET_CREATE_SACRAMENT_OPEN";
        open: boolean;
        sacramentType: SacramentType | null;
    }
    | {
        type: "SET_EDIT_SACRAMENT_OPEN";
        open: boolean;
        sacramentType: SacramentType | null;
        initialValues: any;
    }
    | {
        type: "SET_CREATE_PARISH_OPEN";
        open: boolean;
    }

const INIT_STATE: ArchiveDialogsState = {
    createSacramentOpen: false,
    sacramentType: null,
    editSacramentOpen: false,
    editSacramentType: null,
    editSacramentInitialValues: null,
    createParishOpen: false,
};

function archiveDialogsReducer(
    state: ArchiveDialogsState,
    action: ArchiveDialogsAction,
): ArchiveDialogsState {
    switch (action.type) {
        case "SET_CREATE_SACRAMENT_OPEN":
            return {
                ...state,
                createSacramentOpen: action.open,
                sacramentType: action.sacramentType,
            };
        case "SET_EDIT_SACRAMENT_OPEN":
            return {
                ...state,
                editSacramentOpen: action.open,
                editSacramentType: action.sacramentType,
                editSacramentInitialValues: action.initialValues,
            };
        case "SET_CREATE_PARISH_OPEN":
            return {
                ...state,
                createParishOpen: action.open,
            };
        default:
            return state;
    }
}

const ArchiveDialogsContext = createContext<
    ArchiveDialogsContextType | undefined
>(undefined);

export const useArchiveDialogs = () => {
    const ctx = useContext(ArchiveDialogsContext);
    if (!ctx) {
        throw new Error(
            "useArchiveDialogs must be used within ArchiveDialogsProvider",
        );
    }
    return ctx;
};

export const ArchiveDialogsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(archiveDialogsReducer, INIT_STATE);

    const onCreateSacramentOpenChange = useCallback(
        (open: boolean, sacramentType: SacramentType | null = null) => {
            if (open && state.editSacramentOpen) {
                dispatch({ type: "SET_EDIT_SACRAMENT_OPEN", open: false, sacramentType: null, initialValues: null });
            }
            dispatch({
                type: "SET_CREATE_SACRAMENT_OPEN",
                open,
                sacramentType: sacramentType,
            });
        },
        [],
    );

    const onEditSacramentOpenChange = useCallback(
        (open: boolean, sacramentType: SacramentType | null = null, initialValues: any = null) => {
            if (open && state.createSacramentOpen) {
                dispatch({ type: "SET_CREATE_SACRAMENT_OPEN", open: false, sacramentType: null });
            }
            dispatch({ type: "SET_EDIT_SACRAMENT_OPEN", open, sacramentType, initialValues });
        },
        [],
    );

    const onCreateParishOpenChange = useCallback(
        (open: boolean) => {
            dispatch({ type: "SET_CREATE_PARISH_OPEN", open });
        },
        [],
    );

    const value: ArchiveDialogsContextType = useMemo(
        () => ({
            createSacrament: {
                isOpen: state.createSacramentOpen,
                onOpenChange: onCreateSacramentOpenChange,
                sacramentType: state.sacramentType,
            },
            editSacrament: {
                isOpen: state.editSacramentOpen,
                onOpenChange: onEditSacramentOpenChange,
                sacramentType: state.editSacramentType,
                initialValues: state.editSacramentInitialValues,
            },
            createParish: {
                isOpen: state.createParishOpen,
                onOpenChange: onCreateParishOpenChange,
            },
        }),
        [
            state.createSacramentOpen,
            state.createParishOpen,
            state.sacramentType,
            state.editSacramentOpen,
            state.editSacramentType,
            state.editSacramentInitialValues,
        ],
    );

    return (
        <ArchiveDialogsContext.Provider value={value}>
            {children}
        </ArchiveDialogsContext.Provider>
    );
};
