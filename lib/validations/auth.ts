import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
})

export const registerSchema = z
  .object({
    role: z.enum(['buyer', 'seller'], {
      required_error: 'Selecciona cómo quieres usar PACAPP',
    }),
    full_name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre es demasiado largo'),
    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Ingresa un correo válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña es demasiado larga'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los términos de uso' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
})

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña es demasiado larga'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RecoverPasswordInput = z.infer<typeof recoverPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
