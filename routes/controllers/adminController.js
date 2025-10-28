
const roleService = require('../services/roleService');
const accountService = require('../services/accountService');

exports.getRoles = async (req, res) => {
    const roles = await roleService.getAllRoles();
    res.json(roles);
};

exports.createAccount = async (req, res) => {
    try {
        const newAcc = await accountService.createAccount(req.body);
        res.status(201).json({ message: 'Account created', account: newAcc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const updated = await accountService.updateAccount(req.params.accountId, req.body);
        res.json({ message: 'Account updated', account: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await accountService.deleteAccount(req.params.accountId);
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};