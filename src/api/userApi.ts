import { Roles, User } from '../contracts/userApi';

import sluttkontrollApi from './sluttkontroll';

export const getUsers = async (): Promise<{
    status: number;
    users: Array<User>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/user/users');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateUser = async (
    name: string,
    email: string,
    phone: string,
    roles: Roles[]
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put('/user/', {
            name,
            email,
            phone,
            roles
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        console.log(error);
        throw new Error(error);
    }
};

export const newUser = async (
    name: string,
    email: string,
    phone: string,
    roles: Roles[]
): Promise<{
    status: number;
    user?: User;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/user/', {
            name,
            email,
            phone,
            roles
        });
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        console.log(error);
        throw new Error(error);
    }
};
export const updateByIdUser = async (
    user: User
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.put(`/user/${user.id}`, {
            ...user
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        console.log(error);
        throw new Error(error);
    }
};

export const updatePassword = async (
    password: string
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.post('/user/password', {
            password
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        console.log(error);
        throw new Error(error);
    }
};
