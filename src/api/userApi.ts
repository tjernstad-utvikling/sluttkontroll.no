import { Roles, User } from '../contracts/userApi';

import sluttkontrollApi from './sluttkontroll';

export const getUsers = async (): Promise<{
    status: number;
    users: Array<User>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/user/users');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
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
        const { status } = await sluttkontrollApi.put('/v3/user/', {
            name,
            email,
            phone,
            roles
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error) {
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
        const { status, data } = await sluttkontrollApi.post('/v3/user/', {
            name,
            email,
            phone,
            roles
        });
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
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
        const { status } = await sluttkontrollApi.put(`/v3/user/${user.id}`, {
            ...user
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error) {
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
        const { status } = await sluttkontrollApi.post('/v3/user/password', {
            password
        });
        if (status === 204) {
            return { status };
        }
        throw new Error('not 200');
    } catch (error) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        console.log(error);
        throw new Error(error);
    }
};
