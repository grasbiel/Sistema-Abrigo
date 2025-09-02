import React, {createContext, useState, ReactNode, useContext} from 'react'
import {Alert, Snackbar} from '@mui/material'

interface NotificationContextType {
    showNotification: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void
}

const NotificationContext = createContext<NotificationContextType | undefined> (undefined)

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be use within a NotificationProvider')
    }

    return context
}

export const NotificationProvider = ({children} : {children: ReactNode}) => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info')

    const showNotification = (message: string, severity: 'success'| 'error' | 'warning' | 'info') => {
        setMessage(message)
        setSeverity(severity)
        setOpen(true)
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    return (
        <NotificationContext.Provider value ={{showNotification}}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} variant='filled' sx={{width:'100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    )
}