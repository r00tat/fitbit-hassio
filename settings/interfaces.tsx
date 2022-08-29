export interface PropChangedFunction {
  ({
    index,
    key,
    value,
    action,
  }: {
    index: number;
    key?: string;
    value?: string;
    action?: 'change' | 'moveup' | 'movedown' | 'delete';
  }): void;
}
