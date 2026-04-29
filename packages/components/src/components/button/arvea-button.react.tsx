import React from 'react';
import { createComponent } from '@lit/react';
import { ArvealButton } from './arvea-button';

export const Button = createComponent({
  tagName: 'arvea-button',
  elementClass: ArvealButton,
  react: React,
  events: {
    onArvealClick: 'arvea-click',
  },
});
