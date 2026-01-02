import type { Request, Response } from 'express';
import * as auditorService from '../services/auditorService';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await auditorService.getAuditLogs();
    res.json({ data: logs });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getEvidencePacks = async (req: Request, res: Response) => {
  try {
    const packs = await auditorService.getEvidencePacks();
    res.json({ data: packs });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
