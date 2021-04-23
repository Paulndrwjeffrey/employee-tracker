const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dotenv = require('dotenv').config()
const connection = require('./config/connection')

connection.connect((err) => {
    if (err) throw err
    firstQuestion()
});

const firstQuestion = () => {
    console.log('FUCK')
}