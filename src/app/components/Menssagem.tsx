import { Box, Chip, Typography } from "@mui/joy";

interface msg {
    nome: string;
    msg: string;
}

export default function Menssagem(props: msg) {
    return (
        <Chip color="primary" variant="solid" sx={{ minWidth: 250, px: 2, maxWidth: 200, minHeight: 60 }}>
            <Typography sx={{ mt: 0.3, whiteSpace: 'pre-wrap', color: 'white' }}>
                {props.nome}
            </Typography>
            <Typography sx={{ mt: 0.3, whiteSpace: 'pre-wrap', width: '100%', height: '100%', color: 'white' }}>
                {props.msg}
            </Typography>
        </Chip>
    );
}
