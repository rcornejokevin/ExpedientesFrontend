import {
  AlignRight,
  FileText,
  Folder,
  Network,
  Pencil,
  TableProperties,
  User,
} from 'lucide-react';
import { type MenuConfig } from './types';

export const MENU_SIDEBAR: MenuConfig = [
  { title: 'Gestión de Expedientes', path: '/dashboard', icon: Folder },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: FileText,
  },
  {
    title: 'Catálogos',
    path: '/editor-de-flujos/*',
    icon: TableProperties,
    children: [
      {
        title: 'Editor de Flujos',
        children: [
          {
            children: [
              {
                title: 'Editor de Flujos',
                icon: Network,
                path: '/flujos',
              },
              {
                title: 'Editor de Etapas',
                icon: AlignRight,
                path: '/etapas',
              },
              {
                title: 'Editor de SubEtapas',
                icon: AlignRight,
                path: '/subetapas',
              },
              {
                title: 'Editor de Campos',
                icon: Pencil,
                path: '/campos',
              },
              {
                title: 'Usuarios',
                icon: User,
                path: '/usuarios',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const MENU_MEGA: MenuConfig = [
  { title: 'Gestión de Expedientes', path: '/dashboard', icon: Folder },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: FileText,
  },
  {
    title: 'Catálogos',
    path: '/editor-de-flujos/*',
    icon: TableProperties,
    children: [
      {
        title: 'Editor de Flujos',
        children: [
          {
            children: [
              {
                title: 'Editor de Flujos',
                icon: Network,
                path: '/flujos',
              },
              {
                title: 'Editor de Etapas',
                icon: AlignRight,
                path: '/etapas',
              },
              {
                title: 'Editor de SubEtapas',
                icon: AlignRight,
                path: '/subetapas',
              },
              {
                title: 'Editor de Campos',
                icon: Pencil,
                path: '/campos',
              },
              {
                title: 'Usuarios',
                icon: User,
                path: '/usuarios',
              },
            ],
          },
        ],
      },
    ],
  },
];
export const MENU_MEGA_MOBILE: MenuConfig = [
  { title: 'Gestión de Expedientes', path: '/', icon: Folder },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: FileText,
  },
  {
    title: 'Catálogos',
    path: '/editor-de-flujos/*',
    icon: TableProperties,
    children: [
      {
        title: 'Editor de Flujos',
        icon: Network,
        path: '/flujos',
      },
      {
        title: 'Editor de Etapas',
        icon: AlignRight,
        path: '/etapas',
      },
      {
        title: 'Editor de SubEtapas',
        icon: AlignRight,
        path: '/subetapas',
      },
      {
        title: 'Editor de Campos',
        icon: Pencil,
        path: '/campos',
      },
      {
        title: 'Usuarios',
        icon: User,
        path: '/usuarios',
      },
    ],
  },
];
