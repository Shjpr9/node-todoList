var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await prisma.task.findMany();

        res.json({
            ok: true,
            tasks,
        });
    } catch (error) {
        res
            .json({
                ok: false,
                error,
            })
            .status(500);
    }
});

router.post("/task/create", async (req, res, next) => {
    try {
        if (!req.body.title) {
            return res.json({
                ok: false,
                error: "Title is required",
            });
        }
        const task = await prisma.task.create({
            data: {
                title: req.body.title,
                description: req.body.description,
            },
        });

        res.json({
            ok: true,
            task,
        });
    } catch (error) {
        res
            .json({
                ok: false,
                error,
            })
            .status(500);
    }
});

router.get("/task/:task_id", async (req, res, next) => {
    try {
        const task = await prisma.task.findFirstOrThrow({
            where: {
                id: parseInt(req.params.task_id),
            },
        });

        res.json({
            ok: true,
            task,
        });
    } catch (error) {
        res
            .json({
                ok: false,
                error,
            })
            .status(500);
    }
});

router.delete("/task/:task_id", async (req, res, next) => {
    try {
        await prisma.task.delete({
            where: {
                id: parseInt(req.params.task_id),
            },
        });

        res.json({
            ok: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res
            .json({
                ok: false,
                error,
            })
            .status(500);
    }
});

router.put("/task/:task_id", async (req, res, next) => {
    try {
        if (!req.body.isCompleted & !req.body.title & !req.body.description) {
            return res.json({
                ok: false,
                error: "No data provided to update",
            });
        }
        const task = await prisma.task.update({
            where: {
                id: parseInt(req.params.task_id),
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                isCompleted: (req.body.isCompleted === 'true'),
            },
        });

        res.json({
            ok: true,
            task,
        });
    } catch (error) {
        res
            .json({
                ok: false,
                error,
            })
            .status(500);
    }
});

module.exports = router;