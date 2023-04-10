import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {
    public async login({ request, auth, response }: HttpContextContract) {
        const email = request.input('email');
        const password = request.input('password');

        try {
            const user = await User.findByOrFail('email', email);
            if (user.bloqueado) {
                return response.badRequest({ message: 'bloqueado' });
            }

            let expira;
            switch (user.tipo) {
                case 'admin':
                    expira = '30days';
                    break;
                case 'user':
                    expira = '15days';
                    break;
            }

            const token = await auth.use("api").attempt(email, password, {
                expiresIn: expira,
                name: user.serialize().email,
            });

            response.ok({
                token: token.token,
                expires_at: token.expiresAt,
            });

        } catch (Error) {
            return response.badRequest({ message: 'Invalid email/password' });
        }

    }

    public async logout({ auth, response }: HttpContextContract) {
        try {
            await auth.use("api").revoke();
        } catch {
            return response.unauthorized('no authorization');
        }

        return response.ok({
            revoked: true,
        });

    }

    public async autenticar({ auth, response }: HttpContextContract) {
        const userAuth = await auth.use("api").authenticate();

        let data;

        switch (userAuth.tipo) {
            case 'admin':
                data = {
                    id: userAuth.id,
                    tipo: userAuth.tipo,
                    nome: userAuth.nome,
                    email: userAuth.email,
                    bloqueado: userAuth.bloqueado,
                };
                break;
            case 'user':
                data = {
                    id: userAuth.id,
                    tipo: userAuth.tipo,
                    nome: userAuth.nome,
                    email: userAuth.email,
                    bloqueado: userAuth.bloqueado,
                };
                break;
            default:
                return response.unauthorized('no authorization');
        }

        return response.ok(data);
    }
}
