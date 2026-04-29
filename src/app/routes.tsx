import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { EnglishModule } from './pages/modules/EnglishModule';
import { AlashModule } from './pages/modules/AlashModule';
import { OlenModule } from './pages/modules/OlenModule';
import { IQModule } from './pages/modules/IQModule';
import { TapqirliqModule } from './pages/modules/TapqirliqModule';
import { SozdikModule } from './pages/modules/SozdikModule';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'progress', Component: ProgressPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'admin', Component: AdminPage },
      { path: 'english', Component: EnglishModule },
      { path: 'alash', Component: AlashModule },
      { path: 'olen', Component: OlenModule },
      { path: 'iq', Component: IQModule },
      { path: 'tapqirliq', Component: TapqirliqModule },
      { path: 'sozdik', Component: SozdikModule },
    ],
  },
]);
