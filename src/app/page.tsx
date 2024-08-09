'use client';
import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Box, Chip, Typography } from '@mui/joy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import Menssagem from './components/Menssagem';
import io from 'socket.io-client';
import * as uuid from 'uuid';

interface Message {
  id: string;
  nome: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

const socket = io('http://smulatic037:3001');

export default function Home() {
  const [open, setOpen] = useState<boolean>(true);
  const [nome, setNome] = useState<string>('')
  const [texto, setTexto] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([]);
  const [id, setId] = useState<string>(uuid.v4());

  useEffect(() => {
    function recevedMessage(message: Payload){
      const newMessage: Message = {
        id: id,
        nome: message.name,
        text: message.text
      }
      setMessages([...messages, newMessage]);
    }
    socket.on('msgToClient', (message: Payload) => {
      recevedMessage(message);
    });
    console.log(id);
  }, [messages, texto, nome]);

  function sendMessage() {
    socket.emit('msgToServer', { name: nome, text: texto });
    setTexto('');
  }

  return (
    <>
      <React.Fragment>
        <Modal open={open}>
          <ModalDialog>
            <DialogTitle>Nome de Usuario</DialogTitle>
            <DialogContent>Digite seu nome para continuar.</DialogContent>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input value={nome} onChange={(event) => setNome(event.target.value)} autoFocus required />
                </FormControl>
                <Button type="submit">Entrar</Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </React.Fragment>
      {!open &&
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'neutral.300', width: '50%', height: '70%', borderRadius: 'xl', py: 4, px: 3, display: 'flex' }}>
            <Box sx={{ bgcolor: 'neutral.200', height: '100%', width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 'xl' }}>
              <PersonIcon color='action' sx={{ width: '100%', height: 70, display: 'flex', justifyContent: 'center' }} />
              <Chip color='primary' variant='plain' sx={{ width: '100%', margin: '0 auto' }}>
                {nome.length > 19 ? nome.split(' ')[0] + ' ' + nome.split(' ')[nome.split(' ').length - 1] : nome}
              </Chip>
            </Box>
            <Box sx={{ bgcolor: 'neutral.200', height: '100%', width: '100%', ml: 3, p: 2, borderRadius: 'xl' }}>
              <Box sx={{ bgcolor: 'neutral.100', width: '100%', height: '90%', display: 'flex', alignItems: 'start', p: 2, flexDirection: 'column', gap: 2, overflow: 'auto' }}>
                {
                  messages.map((msg) => (
                    <Menssagem
                      nome={msg.nome}
                      msg={msg.text}
                      key={msg.id}
                      />
                  ))
                }
              </Box>
              <Box sx={{ width: '100%', height: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, gap: 2 }}>
                <Input type='text' sx={{ width: '90%', height: '70%' }} value={texto} onChange={(event) => setTexto(event.target.value)}/>
                <Button type='button' sx={{ width: "40px", height: '70%' }} onClick={() => sendMessage()} disabled={texto.length === 0}>
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      }
    </>
  );
}