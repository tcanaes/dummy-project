//Server
import express from 'express';

//Controllers
import dummyController from '../controllers/dummyController';

const router = express.Router();

router.route('/').get(dummyController.helloWolrd);

export default router;
