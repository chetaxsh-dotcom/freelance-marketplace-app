import express from "express";
import Contract from "../models/Contract.js";

const router = express.Router();


// CREATE CONTRACT
router.post("/", async (req, res) => {

  try {

    const contract = await Contract.create(req.body);

    res.json({
      success: true,
      contract
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});


// GET CONTRACTS
router.get("/", async (req, res) => {

  try {

    const contracts = await Contract.find()
      .sort({ createdAt: -1 });

    res.json(contracts);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});

// UPDATE CONTRACT STATUS

router.patch("/:id", async (req, res) => {

  try {

    const contract =
      await Contract.findByIdAndUpdate(

        req.params.id,

        {
          status: req.body.status
        },

        { new: true }

      );

    res.json({
      success: true,
      contract
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});

export default router;