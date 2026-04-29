import React from 'react';
import { createComponent } from '@lit/react';
import { ArvealAlert } from './arvea-alert';

export const Alert = createComponent({
  tagName: 'arvea-alert',
  elementClass: ArvealAlert,
  react: React,
  events: {
    onArvealDismiss: 'arvea-dismiss',
  },
});
