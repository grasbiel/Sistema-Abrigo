import {useState, useEffect, useCallback} from 'react'
import { IconButton, Badge, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import NotificationIcon from '@mui/icons-material/Notifications'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {format, parseISO} from 'date-fns'
import {ptBR} from 'date-fns/locale'

import apiClient from '../api/axiosConfig'
import {Notificacao} from '../types'
import React from 'react'


// Tipo para a reposta paginada da API
interface PaginatedNotificacoesResponse {
    results: Notificacao []
}


const NotificationBell: React.FC = () => {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const fetchNotificacoes = useCallback(async () => {
        try {
            const response = await apiClient.get<PaginatedNotificacoesResponse>('/notificacoes/')
            setNotificacoes(response.data.results)
        } catch(error) {
            console.error("Erro ao buscar notificações:", error)
        }
    },[])

    useEffect(() => {
        fetchNotificacoes()
    }, [fetchNotificacoes])
    const handleClick = (event: React.MouseEvent<HTMLElement>) =>{ 
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleMarkAsRead = async (id: number) => {
        try {
            await apiClient.post(`/notificacoes/${id}/marcar_como_lida/`)
            setNotificacoes(prev => prev.filter(notif => notif.id !== id))

        } catch(error) {
            console.error("Erro ao marcar notificações como lida:", error)
        }
    }

    const unreadCount= notificacoes.length

    return (
        <>
            <IconButton
                color='inherit'
                onClick={handleClick}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                <Typography variant='h6' sx={{px:2, py:1}}>Notificações</Typography>
                {unreadCount > 0 ? (
                    notificacoes.map(notif =>(
                        <MenuItem key={notif.id}>
                            <ListItemText
                                primary={notif.produto_nome}
                                secondary={`${notif.mensagem} - ${format(parseISO(notif.data_criacao), "dd/MM/yyyy 'às' HH:mm", {locale: ptBR})}`}
                            />
                            <ListItemIcon onClick={() => handleMarkAsRead(notif.id)}>
                                <CheckCircleIcon fontSize='small' color="primary" sx={{cursor: 'pointer', ml: 2}}/>
                            </ListItemIcon>
                            
                            
                        </MenuItem>
                    ))
                ): (
                    <MenuItem disabled>Nenhuma notificação nova.</MenuItem>
                )}

            </Menu>
        </>
    )
}


export default NotificationBell