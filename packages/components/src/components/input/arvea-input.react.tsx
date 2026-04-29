import React from 'react';
import { createComponent } from '@lit/react';
import { ArvealInput } from './arvea-input';

export const Input = createComponent({
  tagName: 'arvea-input',
  elementClass: ArvealInput,
  react: React,
  events: {
    onArvealInput:  'arvea-input',
    onArvealChange: 'arvea-change',
    onArvealFocus:  'arvea-focus',
    onArvealBlur:   'arvea-blur',
  },
});
