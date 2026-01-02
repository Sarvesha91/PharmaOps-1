import { Router } from 'express';
import { generateOrderChecklist, acceptOrderIfCompliant } from '../services/orderService';
import { AppDataSource } from '../data/dataSource';
import { Order } from '../entities/Order';

const router = Router();

router.post('/:id/checklist', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await generateOrderChecklist(id);
    res.json({ checklist: result });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/accept', async (req, res, next) => {
  try {
    const { id } = req.params;
    const performedBy = (req as any).user?.userId as string | undefined;
    const result = await acceptOrderIfCompliant(id, performedBy);
    if (!result.ok) return res.status(400).json({ error: result.reason });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOne({ where: { id }, relations: ['documentStatuses'] });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
