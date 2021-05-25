import { DocumentModule } from 'document';

export interface MyDocument extends DocumentModule, ElementSearch {
  replace(path: string): Promise<void>;
}
