// frontend/src/pages/LoginPage.tsx
import React, { useContext } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { loginUser } = useContext(AuthContext)!;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const username = e.currentTarget.username.value;
        const password = e.currentTarget.password.value;
        loginUser(username, password);
    };

    return (
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="100vh"
            bgcolor="#f0f2f5"
        >
            <Card sx={{ minWidth: 275, maxWidth: 400, padding: 2 }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Acessar o Sistema
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nome de Usuário"
                            name="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Entrar
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;