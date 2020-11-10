import API from '../../api';

export interface ISample {
    id: number;
    num: number;
    message: string;
}

export async function getSamples() {
    return API.get<{ samples: ISample[] }>('sample/read');
}
