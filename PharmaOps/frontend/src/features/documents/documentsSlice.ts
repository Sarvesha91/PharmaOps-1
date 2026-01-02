import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';
import type { RegulatoryDocument } from '../../types';

type DocumentsState = {
  summaries: RegulatoryDocument[];
  selectedDocumentId: string | null;
};

const seedDocuments: RegulatoryDocument[] = [
  {
    id: 'doc-001',
    title: 'EU GMP Annex 1 Update',
    country: 'EU',
    category: 'Submission',
    version: 'v7.2',
    status: 'Approved',
    effectiveDate: '2025-01-15',
    owner: 'QA Europe',
    lastUpdated: '2025-01-04',
  },
  {
    id: 'doc-002',
    title: 'US FDA Labeling SOP',
    country: 'US',
    category: 'SOP',
    version: 'v5.0',
    status: 'In Review',
    effectiveDate: '2025-02-10',
    owner: 'Regulatory Affairs',
    lastUpdated: '2025-01-11',
  },
  {
    id: 'doc-003',
    title: 'ANVISA Cold Chain Validation',
    country: 'BR',
    category: 'Validation',
    version: 'v2.4',
    status: 'Draft',
    effectiveDate: '2025-03-01',
    owner: 'LATAM Ops',
    lastUpdated: '2025-01-06',
  },
];

const initialState: DocumentsState = {
  summaries: seedDocuments,
  selectedDocumentId: seedDocuments[0]?.id ?? null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments(state, action: PayloadAction<RegulatoryDocument[]>) {
      state.summaries = action.payload;
    },
    selectDocument(state, action: PayloadAction<string | null>) {
      state.selectedDocumentId = action.payload;
    },
    upsertDocument(state, action: PayloadAction<RegulatoryDocument>) {
      const idx = state.summaries.findIndex((doc) => doc.id === action.payload.id);
      if (idx >= 0) {
        state.summaries[idx] = action.payload;
      } else {
        state.summaries.unshift(action.payload);
      }
    },
  },
});

export const { setDocuments, selectDocument, upsertDocument } = documentsSlice.actions;

export const selectDocuments = (state: RootState) => state.documents.summaries;
export const selectSelectedDocumentId = (state: RootState) => state.documents.selectedDocumentId;
export const selectSelectedDocument = (state: RootState) =>
  state.documents.summaries.find((doc) => doc.id === state.documents.selectedDocumentId) ?? null;

export default documentsSlice.reducer;

