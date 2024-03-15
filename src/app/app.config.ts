import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom([BrowserAnimationsModule]),

    {
      provide: 'API_URL',
      useValue: 'http://localhost:5000',
      // useValue: 'https://expo-api-k8t6.onrender.com',
    },
  ],
};
