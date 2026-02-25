const express = require('express');
const router = express.Router();

// Sample data for departments (In-memory store)
let departments = [];

// Create a new department
router.post('/departments', (req, res) => {
    const newDepartment = req.body;
    departments.push(newDepartment);
    res.status(201).json(newDepartment);
});

// Get all departments
router.get('/departments', (req, res) => {
    res.status(200).json(departments);
});

// Get a single department
router.get('/departments/:id', (req, res) => {
    const departmentId = req.params.id;
    const department = departments.find(dep => dep.id === departmentId);
    if (department) {
        res.status(200).json(department);
    } else {
        res.status(404).send('Department not found');
    }
});

// Update a department
router.put('/departments/:id', (req, res) => {
    const departmentId = req.params.id;
    let department = departments.find(dep => dep.id === departmentId);
    if (department) {
        department = { ...department, ...req.body };
        res.status(200).json(department);
    } else {
        res.status(404).send('Department not found');
    }
});

// Delete a department
router.delete('/departments/:id', (req, res) => {
    const departmentId = req.params.id;
    departments = departments.filter(dep => dep.id !== departmentId);
    res.status(204).send();
});

// Add an employee to a department
router.post('/departments/:id/employees', (req, res) => {
    const departmentId = req.params.id;
    const employee = req.body;
    const department = departments.find(dep => dep.id === departmentId);
    if (department) {
        if (!department.employees) department.employees = [];
        department.employees.push(employee);
        res.status(201).json(employee);
    } else {
        res.status(404).send('Department not found');
    }
});

// Remove an employee from a department
router.delete('/departments/:depid/employees/:empid', (req, res) => {
    const departmentId = req.params.depid;
    const employeeId = req.params.empid;
    const department = departments.find(dep => dep.id === departmentId);
    if (department && department.employees) {
        department.employees = department.employees.filter(emp => emp.id !== employeeId);
        res.status(204).send();
    } else {
        res.status(404).send('Department or Employee not found');
    }
});

module.exports = router;