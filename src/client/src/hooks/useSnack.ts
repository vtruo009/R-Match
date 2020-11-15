import { useSnackbar } from 'notistack';

type variantType = 'default' | 'warning' | 'error' | 'info' | 'success';

export default function useSnack() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    return [
        (message: string, type: variantType) => {
            enqueueSnackbar(message, { variant: type });
        },
        closeSnackbar,
    ];
}
