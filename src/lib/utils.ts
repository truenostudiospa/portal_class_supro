import { clsx, type ClassValue } from 'clsx'; import { twMerge } from 'tailwind-merge'
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
export const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
export const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD' }).format(price)
