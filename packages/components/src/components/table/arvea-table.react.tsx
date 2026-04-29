import React from 'react';
import { createComponent } from '@lit/react';
import { ArvealTable } from './arvea-table';
import type { ColumnDef, RowAction, TableSortDir, TableResponsive } from './arvea-table';

const _Table = createComponent({
  tagName: 'arvea-table',
  elementClass: ArvealTable,
  react: React,
});

export interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns?:   ColumnDef<T>[];
  data?:      T[];
  actions?:   RowAction<T>[];
  sortKey?:   string;
  sortDir?:   TableSortDir;
  responsive?: TableResponsive;
  pageSize?:  number;
  page?:      number;
}

export function ArveaTable<T extends Record<string, unknown> = Record<string, unknown>>(
  props: TableProps<T>
) {
  return <_Table {...(props as React.ComponentProps<typeof _Table>)} />;
}
