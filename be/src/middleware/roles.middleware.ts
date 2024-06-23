import {roles} from '../config/app'

interface Role {
    name: string;
}

const checkRole = (requiredRoles: string[]) => {
    return (req: any, res: any, next: any) => {
        // Assuming req.user contains the authenticated user's information
        const userRoles = req.user.roles.map((role: Role) => role.name);

        // Check if the user has at least one of the required roles
        const hasRequiredRole = requiredRoles.some((role: string) => userRoles.includes(role));

        if (hasRequiredRole) {
            next();
        } else {
            res.status(403).json({error: 'Forbidden'});
        }
    };
};

export {checkRole};
