import { Column, ColumnOptions, ColumnType } from 'typeorm';

export function CustomColumn(
  columnOptions: ColumnOptions & { testingType: ColumnType },
) {
  if (process.env.NODE_ENV === 'test') {
    columnOptions.type = columnOptions.testingType;
  }
  return Column(columnOptions);
}
